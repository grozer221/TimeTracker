﻿using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.Services
{
    public class CalendarDaysService
    {
        private readonly CalendarDayRepository calendarDayRepository;
        private readonly SettingsManager settingsManager;

        public CalendarDaysService(CalendarDayRepository calendarDayRepository, SettingsManager settingsManager)
        {
            this.calendarDayRepository = calendarDayRepository;
            this.settingsManager = settingsManager;
        }

        public async Task<int> GetAmountWorkingHoursInMonth(DateTime dateTime)
        {
            var from = new DateTime(dateTime.Year, dateTime.Month, 1);
            var to = from.AddMonths(1).AddDays(-1);
            var calendarDaysInMonth = await calendarDayRepository.GetAsync(from, to);
            var settings = await settingsManager.GetAsync();
            var givenMonthDays = Enumerable.Range(0, 1 + to.Subtract(from).Days)
                .Select(offset => from.AddDays(offset))
                .ToArray();
            return givenMonthDays.Sum(day =>
            {
                var calendarDayInMonth = calendarDaysInMonth.FirstOrDefault(calendarDay => calendarDay.Date == day);
                if (calendarDayInMonth == null)
                {
                    return settings.Employment.HoursInWorkday;
                }
                return calendarDayInMonth.WorkHours;
            });
        }
    }
}
