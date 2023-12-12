using Quartz;

using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Repositories;

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

            var dateTimeOffsetNow = DateTimeOffset.UtcNow;
            foreach (var task in tasks)
            {
                var lastCompletedTask = await completedTaskRepository.GetLastExecutedAsync(task.JobName);
                if (lastCompletedTask == null)
                    continue;

                var cron = task.GetCronAsync();
                var cronExpression = new CronExpression(cron);
                cronExpression.TimeZone = TimeZoneInfo.Utc;

                var lastDateExecute = DateTime.SpecifyKind(lastCompletedTask.DateExecute, DateTimeKind.Utc);
                var currentDateExecute = cronExpression.GetTimeAfter(lastDateExecute).Value;
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
