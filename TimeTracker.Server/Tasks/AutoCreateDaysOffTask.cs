﻿using Quartz;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Managers;
using TimeTracker.Business.Models;

namespace TimeTracker.Server.Tasks
{
    public class AutoCreateDaysOffTask : IJob
    {
        public static string JobName => "AutoCreateDaysOffTask";
        public static JobKey JobKey => new JobKey(JobName);
        public static string TriggerName => JobName + "-Trigger";
        public static TriggerKey TriggerKey => new TriggerKey(TriggerName);

        private readonly ISettingsManager settingsManager;
        private readonly ICalendarDayManager calendarDayManager;

        public AutoCreateDaysOffTask(ISettingsManager settingsManager, ICalendarDayManager calendarDayManager)
        {
            this.settingsManager = settingsManager;
            this.calendarDayManager = calendarDayManager;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var settings = await settingsManager.GetAsync();
            var dateTimeNow = DateTime.Now;
            var mondayDate = DateTime.Today;
            mondayDate = mondayDate
                       .AddDays(-(((mondayDate.DayOfWeek - DayOfWeek.Monday) + 7) % 7));
            var saturdayDate = mondayDate.AddDays(7);
            var numDays = (int)((saturdayDate - mondayDate).TotalDays);
            var currentWeekDates = Enumerable
                       .Range(0, numDays)
                       .Select(x => mondayDate.AddDays(x))
                       .ToList();
            var datesForCreateDayOff = currentWeekDates.Where(date => settings.Tasks.AutoCreateDaysOff.DaysOfWeek.Contains(date.DayOfWeek)).ToList();
            foreach (var dateForCreateDayOff in datesForCreateDayOff)
            {
                var calendarDay = await calendarDayManager.GetByDateAsync(dateForCreateDayOff);
                if(calendarDay == null)
                {
                    await calendarDayManager.CreateAsync(new CalendarDayModel
                    {
                        Date = dateForCreateDayOff,
                        Kind = DayKind.DayOff,
                    });
                }
            }
            Console.WriteLine($"[{DateTime.Now}] -- AutoCreateDaysOffTask");
        }

        public async Task<ITrigger> CreateTriggerAsync()
        {
            var cron = await GetCron();
            return TriggerBuilder.Create()
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron)
                .Build();
        }

        public async Task<ITriggerConfigurator> ConfigureTriggerConfiguratorAsync(ITriggerConfigurator configurator)
        {
            var cron = await GetCron();
            return configurator
                .ForJob(JobKey)
                .WithIdentity(TriggerKey)
                .WithCronSchedule(cron);
        }

        private async Task<string> GetCron()
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
