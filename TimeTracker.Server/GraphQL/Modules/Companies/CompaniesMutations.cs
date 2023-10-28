using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Companies.Types;

namespace TimeTracker.Server.GraphQL.Modules.Companies
{
    public class CompaniesMutations : ObjectGraphType
    {
        public CompaniesMutations(CompanyRepository companyRepository, IValidator<CompanyInput> companyInputValidator)
        {
            Field<NonNullGraphType<CompanyType>>()
              .Name("Create")
              .Argument<NonNullGraphType<CompanyInputType>>("input", "")
              .ResolveAsync(async context =>
              {
                  var input = context.GetArgument<CompanyInput>("input");
                  companyInputValidator.ValidateAndThrow(input);

                  var sickLeave = input.ToModel();

                  return await companyRepository.CreateAsync(sickLeave);
              })
              .AuthorizeWith(AuthPolicies.SuperAdmin);

            Field<NonNullGraphType<CompanyType>>()
                .Name("Update")
                .Argument<NonNullGraphType<GuidGraphType>>("id", "")
                .Argument<NonNullGraphType<CompanyInputType>>("input", "")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("id");
                    var input = context.GetArgument<CompanyInput>("input");
                    companyInputValidator.ValidateAndThrow(input);

                    var company = await companyRepository.GetByIdAsync(id)
                        ?? throw new Exception("Company not found");

                    company.Name = input.Name;
                    company.Email = input.Email;

                    return await companyRepository.UpdateAsync(company);
                })
                .AuthorizeWith(AuthPolicies.SuperAdmin);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("Remove")
               .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "")
               .ResolveAsync(async context =>
               {
                   var id = context.GetArgument<Guid>("Id");
                   var company = await companyRepository.GetByIdAsync(id)
                       ?? throw new Exception("Company not found");

                   await companyRepository.RemoveAsync(company.Id);

                   return true;
               })
               .AuthorizeWith(AuthPolicies.SuperAdmin);
        }
    }
}
