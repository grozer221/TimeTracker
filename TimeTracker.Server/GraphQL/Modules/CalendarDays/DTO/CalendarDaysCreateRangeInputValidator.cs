﻿using FluentValidation;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysCreateRangeInputValidator : AbstractValidator<CalendarDaysCreateRangeInput>
    {
        public CalendarDaysCreateRangeInputValidator()
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
                        return input.PercentageWorkHours == 0;
                    return true;
                }).WithMessage("In day off percentage work hours must be 0");

            RuleFor(l => l.PercentageWorkHours)
                .NotNull()
                .GreaterThanOrEqualTo(0)
                .LessThanOrEqualTo(100);
        }
    }
}
