using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Companies.Types;

namespace TimeTracker.Server.GraphQL.Modules.Companies
{
    public class CompaniesQueries : ObjectGraphType
    {
        public CompaniesQueries(CompanyRepository companyRepository)
        {
            Field<NonNullGraphType<GetEntitiesResponseType<CompanyType, CompanyModel>>>()
               .Name("Get")
               .Argument<NonNullGraphType<PagingType>>("paging", "")
               .ResolveAsync(async context =>
               {
                   var paging = context.GetArgument<Paging>("paging");
                   return await companyRepository.GetAsync(paging.PageNumber, paging.PageSize);
               })
               .AuthorizeWith(AuthPolicies.SuperAdmin);

            Field<NonNullGraphType<CompanyType>>()
                .Name("GetById")
                .Argument<NonNullGraphType<GuidGraphType>>("id", "")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("Id");
                    var company = await companyRepository.GetByIdAsync(id);
                    if (company == null)
                        throw new ExecutionError("Company not found");

                    return company;
                })
                .AuthorizeWith(AuthPolicies.SuperAdmin);
        }
    }
}
