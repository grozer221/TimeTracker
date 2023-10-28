using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Users.DTO
{
    public class UsersCreateInputValidator : AbstractValidator<UsersCreateInput>
    {
        public UsersCreateInputValidator(UserRepository userRepository)
        {
            RuleFor(l => l.Email)
                .EmailAddress()
                .NotEmpty()
                .NotNull()
                .MustAsync(async (email, cancellation) =>
                {
                    var user = await userRepository.GetByEmailAsync(email);
                    return user == null;
                }).WithMessage("Email already taken");

            RuleFor(l => l.Password)
                .MinimumLength(5)
                .NotEmpty()
                .NotNull();

            RuleFor(l => l.FirstName)
                .NotEmpty()
                .NotNull();

            RuleFor(l => l.LastName)
                .NotEmpty()
                .NotNull();

            RuleFor(l => l.MiddleName)
                .NotEmpty()
                .NotNull();

            RuleFor(l => l.Permissions)
                .NotNull()
                .Must(permissions =>
                {
                    return permissions.Count() == permissions.Distinct().Count();
                })
                .WithMessage("Permissions can not duplicate");

            RuleFor(l => l.UsersWhichCanApproveVacationRequestIds)
                .NotNull()
                .MustAsync(async (usersWhichCanApproveVacationRequestIds, _) =>
                {
                    foreach (var usersWhichCanApproveVacationRequestId in usersWhichCanApproveVacationRequestIds)
                    {
                        var user = await userRepository.GetByIdAsync(usersWhichCanApproveVacationRequestId);
                        if (user == null)
                            return false;
                    }
                    return true;
                })
                .WithMessage("One of users which can approve vacation request ids does not exists")
                .Must(usersWhichCanApproveVacationRequestIds =>
                {
                    return usersWhichCanApproveVacationRequestIds.Count() == usersWhichCanApproveVacationRequestIds.Distinct().Count();
                })
                .WithMessage("Users which can approve vacation request ids can not duplicate");
        }
    }
}
