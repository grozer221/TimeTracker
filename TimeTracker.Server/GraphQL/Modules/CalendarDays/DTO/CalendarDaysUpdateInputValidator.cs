using FluentValidation;

using TimeTracker.Business.Enums;
using TimeTracker.Server.DataAccess.Managers;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysUpdateInputValidator : AbstractValidator<CalendarDaysUpdateInput>
    {
        public CalendarDaysUpdateInputValidator(SettingsManager settingsManager)
        {
            RuleFor(l => l.Id)
                .NotEmpty()
                .NotNull();

            RuleFor(l => l.Date)
                .NotNull();

            RuleFor(l => l.Kind)
                .NotNull()
                .Must((input, kind) =>
                {
                    if (kind == DayKind.DayOff)
                        return input.WorkHours == 0;
                    return true;
                }).WithMessage("In day off work hours must be 0");

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
