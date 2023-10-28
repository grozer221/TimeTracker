using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Tracks.DTO
{
    public class TrackOtherInputTypeValidation : AbstractValidator<TrackOtherInput>
    {
        public TrackOtherInputTypeValidation(UserRepository userRepository)
        {
            RuleFor(l => l.Title);

            RuleFor(l => l.EndTime)
                .Must((input, to) =>
                {
                    var result = DateTime.Compare(input.StartTime, input.EndTime);
                    return result < 1;
                }).WithMessage("EndTime must be greater than StartTime");

            RuleFor(l => l.UserId)
                .NotEmpty()
                .NotNull()
                .MustAsync(async (input, id, token) =>
                {
                    var user = await userRepository.GetByIdAsync(id);
                    if (user == null)
                        return false;
                    return true;
                });
        }
    }
}
