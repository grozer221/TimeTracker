using Quartz;

using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.Tasks
{
    public class CleanupExpiredSubscriptionsTask : ITask
    {
        public string JobName => GetType().Name;
        public JobKey JobKey => new JobKey(JobName);
        public string TriggerName => JobName + "-Trigger";
        public TriggerKey TriggerKey => new TriggerKey(TriggerName);

        private readonly IServiceProvider serviceProvider;
        private readonly DapperContext dapperContext;
        private readonly ActiveSubscriptionRepository activeSubscriptionRepository;

        public CleanupExpiredSubscriptionsTask(
            IServiceProvider serviceProvider,
            DapperContext dapperContext,
            ActiveSubscriptionRepository activeSubscriptionRepository)
        {
            this.serviceProvider = serviceProvider;
            this.dapperContext = dapperContext;
            this.activeSubscriptionRepository = activeSubscriptionRepository;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var nowUtc = DateTime.UtcNow;
            await ExecuteAsync(context, nowUtc);
        }

        public async Task ExecuteAsync(IJobExecutionContext? context, DateTime dateTimeNow)
        {
            var expiredSubscriptions = await activeSubscriptionRepository.GetExpiredAsync();
            using (var connection = dapperContext.CreateConnection())
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    foreach (var subscription in expiredSubscriptions)
                    {
                        await activeSubscriptionRepository.RemoveAsync(subscription.Id);
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
            return "0 0 1 ? * *";
        }
    }
}
