using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class CreateCompanyInputTypeValidator : AbstractValidator<CreateCompanyInput>
{
    public CreateCompanyInputTypeValidator(CompanyRepository companyRepository)
    {
        RuleFor(l => l.Name)
            .NotEmpty()
            .NotNull();

        RuleFor(l => l.Email)
            .NotEmpty()
            .NotNull()
            .EmailAddress()
            .MustAsync(async (email, cancellation) =>
            {
                var company = await companyRepository.GetByEmailAsync(email);
                return company == null;
            }).WithMessage("Email already taken");
    }
}
