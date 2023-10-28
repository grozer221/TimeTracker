using FluentValidation;

using TimeTracker.Business.Enums;
using TimeTracker.Server.DataAccess.Managers;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysCreateRangeInputValidator : AbstractValidator<CalendarDaysCreateRangeInput>
    {
        public CalendarDaysCreateRangeInputValidator(SettingsManager settingsManager)
        {
            RuleFor(l => l.From)
                .NotNull();

            RuleFor(l => l.To)
                .NotNull()
                .Must((input, to) =>
                {
                    var result = DateTime.Compare(input.From, input.To);
                    return result < 1;
                }).WithMessage("From must be greater than To");

            RuleFor(l => l.DaysOfWeek)
                .NotNull()
                .Must((input, dayOfWeeks) =>
                {
                    return dayOfWeeks.Count() > 0;
                }).WithMessage("You must specify days of week");

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
