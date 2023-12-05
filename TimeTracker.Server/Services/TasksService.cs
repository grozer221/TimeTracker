using Quartz;

using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Tasks;

namespace TimeTracker.Server.Services
{
    public class TasksService : IHostedService
    {
        private readonly ISchedulerFactory schedulerFactory;
        private readonly IServiceProvider serviceProvider;

        public TasksService(ISchedulerFactory schedulerFactory, IServiceProvider serviceProvider)
        {
            this.schedulerFactory = schedulerFactory;
            this.serviceProvider = serviceProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var tasks = scope.ServiceProvider.GetRequiredService<IEnumerable<ITask>>();
            var completedTaskRepository = scope.ServiceProvider.GetRequiredService<CompletedTaskRepository>();
            var autoCreateDaysOffTask = scope.ServiceProvider.GetRequiredService<AutoCreateDaysOffTask>();
            var autoCreateTracks = scope.ServiceProvider.GetRequiredService<AutoCreateTracksTask>();
            var settingsManager = scope.ServiceProvider.GetRequiredService<SettingsManager>();
            SettingsModel settings;
            try
            {
                settings = await settingsManager.GetAsync();
            }
            catch
            {
                settings = new SettingsModel();
            }

            var scheduler = await schedulerFactory.GetScheduler();
            if (!settings.Tasks.AutoCreateDaysOff.IsEnabled)
            {
                await autoCreateDaysOffTask.PauseAsync();
            }
            if (!settings.Tasks.AutoCreateTracks.IsEnabled)
            {
                await autoCreateTracks.PauseAsync();
            }

            var dateTimeOffsetNow = DateTimeOffset.UtcNow;
            foreach (var task in tasks)
            {
                var lastCompletedTask = await completedTaskRepository.GetLastExecutedAsync(task.JobName);
                if (lastCompletedTask == null)
                    continue;

                string cron = await task.GetCronAsync();
                var cronExpression = new CronExpression(cron);
                cronExpression.TimeZone = TimeZoneInfo.Utc;

                var lastDateExecute = DateTime.SpecifyKind(lastCompletedTask.DateExecute, DateTimeKind.Utc);
                DateTimeOffset currentDateExecute = cronExpression.GetTimeAfter(lastDateExecute).Value;
                while (DateTimeOffset.Compare(currentDateExecute, dateTimeOffsetNow) < 1)
                {
                    await task.ExecuteAsync(null, currentDateExecute.DateTime);
                    currentDateExecute = cronExpression.GetTimeAfter(currentDateExecute).Value;
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
