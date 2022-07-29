﻿using FluentValidation;
using TimeTracker.Business.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Tracks.DTO
{
    public class TrackUpdateInputTypeValidation : AbstractValidator<TrackUpdateInput>
    {
        public TrackUpdateInputTypeValidation(ITrackRepository trackRepository)
        {
            RuleFor(l => l.Title);

            RuleFor(l => l.EndTime)
                .Must((input, to) =>
                {
                    if (input.EndTime != null && input.StartTime != null)
                    {
                        var result = DateTime.Compare(input.StartTime.Value, input.EndTime.Value);
                        return result < 1;
                    }
                    return true;
                }).WithMessage("EndTime must be greater than StartTime");

            RuleFor(l => l.Id)
                .NotEmpty()
                .NotNull()
                .MustAsync(async (input, id, token) =>
                {
                    var track = await trackRepository.GetByIdAsync(id);
                    if (track == null)
                        return false;
                    return true;
                });
        }
    }
}
