using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class UpdateCompanyInputTypeValidator : AbstractValidator<UpdateCompanyInput>
{
    public UpdateCompanyInputTypeValidator(CompanyRepository companyRepository)
    {
        RuleFor(l => l.Name)
            .NotEmpty()
            .NotNull();

        RuleFor(l => l.Email)
            .NotEmpty()
            .NotNull()
            .EmailAddress()
            .MustAsync(async (company, email, cancellation) =>
            {
                var checkCompany = await companyRepository.GetByEmailAsync(email);
                return checkCompany == null || checkCompany.Id == company.Id;
            }).WithMessage("Email already taken");
    }
}
