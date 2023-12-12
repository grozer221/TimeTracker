using Quartz;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.Tasks
{
    public class AutoCreateTracksTask : ITask
    {
        public string JobName => GetType().Name;
        public JobKey JobKey => new JobKey(JobName);
        public string TriggerName => JobName + "-Trigger";
        public TriggerKey TriggerKey => new TriggerKey(TriggerName);

        private readonly SettingsManager settingsManager;
        private readonly IServiceProvider serviceProvider;
        private readonly UserRepository userRepository;
        private readonly TrackRepository trackRepository;
        private readonly VacationRequestRepository vacationRequestRepository;
        private readonly SickLeaveRepository sickLeaveRepository;
        private readonly DapperContext dapperContext;
        private readonly CalendarDayRepository calendarDayRepository;

        public AutoCreateTracksTask(
            SettingsManager settingsManager,
            IServiceProvider serviceProvider,
            UserRepository userRepository,
            TrackRepository trackRepository,
            VacationRequestRepository vacationRequestRepository,
            SickLeaveRepository sickLeaveRepository,
            DapperContext dapperContext,
            CalendarDayRepository calendarDayRepository)
        {
            this.settingsManager = settingsManager;
            this.serviceProvider = serviceProvider;
            this.userRepository = userRepository;
            this.trackRepository = trackRepository;
            this.vacationRequestRepository = vacationRequestRepository;
            this.sickLeaveRepository = sickLeaveRepository;
            this.dapperContext = dapperContext;
            this.calendarDayRepository = calendarDayRepository;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var nowUtc = DateTime.UtcNow;
            await ExecuteAsync(context, nowUtc);
        }

        public async Task ExecuteAsync(IJobExecutionContext? context, DateTime dateTimeNow)
        {
            var settings = await settingsManager.GetAsync();
            var hoursInWorkday = settings.Employment.HoursInWorkday;
            var workdayStartAt = settings.Employment.WorkdayStartAt;
            var workdayStartAtDateTime = new DateTime(dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, workdayStartAt.Hour, workdayStartAt.Minute, workdayStartAt.Second);
            var currentCalendarDay = await calendarDayRepository.GetByDateAsync(dateTimeNow);
            var workHours = currentCalendarDay != null ? currentCalendarDay.WorkHours : hoursInWorkday;
            if (workHours == 0)
                return;

            var workdayEndAtDateTime = workdayStartAtDateTime.AddHours(workHours);
            var users = await userRepository.GetAllAsync();
            using (var connection = dapperContext.CreateConnection())
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    foreach (var user in users)
                    {
                        var trackKinds = new List<TrackKind>();
                        var trackCreation = TrackCreation.Automatically;
                        var todayVacationRequest = await vacationRequestRepository.GetByDateAsync(dateTimeNow, user.Id);
                        if (todayVacationRequest != null)
                        {
                            trackKinds.Add(TrackKind.Vacation);
                        }

                        var todaySickLeave = await sickLeaveRepository.GetByDateAsync(dateTimeNow, user.Id);
                        if (todaySickLeave != null)
                        {
                            trackKinds.Add(TrackKind.Sick);
                        }

                        if (trackKinds.Count == 0 && user.Employment == Employment.FullTime)
                        {
                            trackKinds.Add(TrackKind.Working);
                        }
                        foreach (var trackKind in trackKinds)
                        {
                            var track = new TrackModel
                            {
                                Id = Guid.NewGuid(),
                                Title = "Auto created",
                                Creation = trackCreation,
                                StartTime = workdayStartAtDateTime,
                                EndTime = workdayEndAtDateTime,
                                Kind = trackKind,
                                UserId = user.Id,
                            };
                            await trackRepository.CreateAsync(track, connection, transaction);
                        }
                    }
                    var compeltedTask = new CompletedTaskModel
                    {
                        DateExecute = dateTimeNow,
                        Name = JobName,
                    };
                    await CompletedTaskRepository.CreateAsync(connection, compeltedTask, transaction);
                    transaction.Commit();
                }
            }

            Console.WriteLine($"[{DateTime.UtcNow}] -- {JobName} for {dateTimeNow}");
        }

        public async Task<ITrigger> CreateTriggerAsync()
        {
            var cron = GetCronAsync();
            return TriggerBuilder.Create()
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron, builder => builder.InTimeZone(TimeZoneInfo.Utc))
                .Build();
        }

        public async Task<ITriggerConfigurator> ConfigureTriggerConfiguratorAsync(ITriggerConfigurator configurator)
        {
            var cron = GetCronAsync();
            return configurator
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron, builder => builder.InTimeZone(TimeZoneInfo.Utc));
        }

        public string GetCronAsync()
        {
            return $"0 0 1 ? * *";
        }
    }
}
