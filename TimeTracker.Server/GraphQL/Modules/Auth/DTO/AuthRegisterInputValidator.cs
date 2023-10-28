using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthRegisterInputValidator : AbstractValidator<AuthRegisterInput>
    {
        public AuthRegisterInputValidator(UserRepository userRepository)
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
        }
    }
}
