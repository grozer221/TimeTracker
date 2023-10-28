using FluentValidation;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class CompanyInputValidator : AbstractValidator<CompanyInput>
{
    public CompanyInputValidator()
    {
        RuleFor(l => l.Name)
            .NotEmpty()
            .NotNull();

        RuleFor(l => l.Email)
            .NotEmpty()
            .NotNull()
            .EmailAddress();
    }
}
