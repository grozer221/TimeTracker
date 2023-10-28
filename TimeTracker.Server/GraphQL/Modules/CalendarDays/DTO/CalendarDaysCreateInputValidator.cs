using FluentValidation;

using TimeTracker.Business.Enums;
using TimeTracker.Server.DataAccess.Managers;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysCreateInputValidator : AbstractValidator<CalendarDaysCreateInput>
    {
        public CalendarDaysCreateInputValidator(CalendarDayManager calendarDayManager, SettingsManager settingsManager)
        {
            RuleFor(l => l.Title);

            RuleFor(l => l.Date)
                .NotNull()
                .MustAsync(async (input, date, _) =>
                {
                    var exists = await calendarDayManager.GetByDateAsync(date) != null;
                    if (input.Override && exists)
                        await calendarDayManager.RemoveAsync(date);
                    return !exists;
                }).WithMessage(input => $"Calendar day for {input.Date.ToString("yyyy-MM-dd")} already exists");

            RuleFor(l => l.Kind)
                .NotNull()
                .Must((input, kind) =>
                {
                    if (kind == DayKind.DayOff)
                        return input.WorkHours == 0;
                    return true;
                }).WithMessage("In day off - work hours must be 0");

            RuleFor(l => l.WorkHours)
                .NotNull()
                .GreaterThanOrEqualTo(0)
                .MustAsync(async (input, workHours, _) =>
                {
                    var settings = await settingsManager.GetAsync();
                    return workHours <= settings.Employment.HoursInWorkday;
                }).WithMessage("Work hours must be less then hours in workday");
        }
    }
}
