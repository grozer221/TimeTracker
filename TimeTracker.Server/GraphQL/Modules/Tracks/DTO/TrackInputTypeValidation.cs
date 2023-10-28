using FluentValidation;

namespace TimeTracker.Server.GraphQL.Modules.Tracks.DTO
{
    public class TrackInputTypeValidation : AbstractValidator<TrackInput>
    {
        public TrackInputTypeValidation()
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
        }
    }
}
