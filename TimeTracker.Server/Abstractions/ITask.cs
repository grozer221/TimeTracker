using Quartz;

namespace TimeTracker.Server.Abstractions
{
    public interface ITask : IJob
    {
        string JobName { get; }
        JobKey JobKey { get; }
        string TriggerName { get; }
        TriggerKey TriggerKey { get; }
        Task ExecuteAsync(IJobExecutionContext? context, DateTime dateTimeNow);
        Task<ITrigger> CreateTriggerAsync();
        Task<ITriggerConfigurator> ConfigureTriggerConfiguratorAsync(ITriggerConfigurator configurator);
        string GetCronAsync();
    }
}
