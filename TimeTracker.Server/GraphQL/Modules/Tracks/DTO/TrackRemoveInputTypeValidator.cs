using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Tracks.DTO
{
    public class TrackRemoveInputTypeValidator : AbstractValidator<TrackRemoveInput>
    {
        public TrackRemoveInputTypeValidator(TrackRepository trackRepository)
        {
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
