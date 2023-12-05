using Quartz;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.Tasks
{
    public class AutoCreateDaysOffTask : ITask
    {
        public string JobName => GetType().Name;
        public JobKey JobKey => new JobKey(JobName);
        public string TriggerName => JobName + "-Trigger";
        public TriggerKey TriggerKey => new TriggerKey(TriggerName);

        private readonly SettingsManager settingsManager;
        private readonly CalendarDayRepository calendarDayRepository;
        private readonly IServiceProvider serviceProvider;
        private readonly CompletedTaskRepository completedTaskRepository;
        private readonly DapperContext dapperContext;

        public AutoCreateDaysOffTask(
            SettingsManager settingsManager,
            CalendarDayRepository calendarDayRepository,
            IServiceProvider serviceProvider,
            CompletedTaskRepository completedTaskRepository,
            DapperContext dapperContext)
        {
            this.settingsManager = settingsManager;
            this.calendarDayRepository = calendarDayRepository;
            this.serviceProvider = serviceProvider;
            this.completedTaskRepository = completedTaskRepository;
            this.dapperContext = dapperContext;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var nowUtc = DateTime.UtcNow;
            await ExecuteAsync(context, nowUtc);
        }

        public async Task ExecuteAsync(IJobExecutionContext? context, DateTime dateTimeNow)
        {
            var settings = await settingsManager.GetAsync();
            int diff = (7 + (dateTimeNow.DayOfWeek - DayOfWeek.Monday)) % 7;
            var mondayDate = dateTimeNow.AddDays(-1 * diff).Date;
            mondayDate = mondayDate
                .AddDays(-(((mondayDate.DayOfWeek - DayOfWeek.Monday) + 7) % 7));
            var saturdayDate = mondayDate.AddDays(7);
            var numDays = (int)((saturdayDate - mondayDate).TotalDays);
            var currentWeekDates = Enumerable
                .Range(0, numDays)
                .Select(x => mondayDate.AddDays(x))
                .ToList();
            var datesForCreateDayOff = currentWeekDates.Where(date => settings.Tasks.AutoCreateDaysOff.DaysOfWeek.Contains(date.DayOfWeek)).ToList();
            using (var connection = dapperContext.CreateConnection())
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    foreach (var dateForCreateDayOff in datesForCreateDayOff)
                    {
                        var calendarDay = await calendarDayRepository.GetByDateAsync(dateForCreateDayOff);
                        if (calendarDay == null)
                        {
                            var newCalendarDay = new CalendarDayModel
                            {
                                Date = dateForCreateDayOff,
                                Kind = DayKind.DayOff,
                            };
                            await calendarDayRepository.CreateAsync(newCalendarDay, connection, transaction);
                        }
                    }
                    var completedTask = new CompletedTaskModel
                    {
                        DateExecute = dateTimeNow,
                        Name = JobName,
                    };
                    await CompletedTaskRepository.CreateAsync(connection, completedTask, transaction);
                    transaction.Commit();
                }
            }

            Console.WriteLine($"[{DateTime.UtcNow}] -- {JobName} for {mondayDate} - {saturdayDate}");
        }

        public async Task ResumeAsync()
        {
            using var scope = serviceProvider.CreateScope();
            var schedulerFactory = scope.ServiceProvider.GetRequiredService<ISchedulerFactory>();
            var scheduler = await schedulerFactory.GetScheduler();
            await scheduler.ResumeJob(JobKey);
        }

        public async Task PauseAsync()
        {
            using var scope = serviceProvider.CreateScope();
            var schedulerFactory = scope.ServiceProvider.GetRequiredService<ISchedulerFactory>();
            var scheduler = await schedulerFactory.GetScheduler();
            await scheduler.PauseJob(JobKey);
        }

        public async Task RescheduleAsync()
        {
            using var scope = serviceProvider.CreateScope();
            var schedulerFactory = scope.ServiceProvider.GetRequiredService<ISchedulerFactory>();
            var scheduler = await schedulerFactory.GetScheduler();
            await scheduler.RescheduleJob(TriggerKey, await CreateTriggerAsync());

            var settings = await settingsManager.GetAsync();
            if (settings.Tasks.AutoCreateDaysOff.IsEnabled)
                await ResumeAsync();
            else
                await PauseAsync();
        }

        public async Task<ITrigger> CreateTriggerAsync()
        {
            var cron = await GetCronAsync();
            return TriggerBuilder.Create()
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron, builder => builder.InTimeZone(TimeZoneInfo.Utc))
                .Build();
        }

        public async Task<ITriggerConfigurator> ConfigureTriggerConfiguratorAsync(ITriggerConfigurator configurator)
        {
            var cron = await GetCronAsync();
            return configurator
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron, builder => builder.InTimeZone(TimeZoneInfo.Utc));
        }

        public async Task<string> GetCronAsync()
        {
            SettingsModel settings;
            try
            {
                settings = await settingsManager.GetAsync();
            }
            catch
            {
                settings = new SettingsModel();
            }
            var hour = settings.Tasks.AutoCreateDaysOff.TimeWhenCreate.Hour;
            var minute = settings.Tasks.AutoCreateDaysOff.TimeWhenCreate.Minute;
            var second = settings.Tasks.AutoCreateDaysOff.TimeWhenCreate.Second;
            var daysOfWeek = (int)settings.Tasks.AutoCreateDaysOff.DayOfWeekWhenCreate + 1;
            return $"{second} {minute} {hour} ? * {daysOfWeek}";
        }
    }
}
