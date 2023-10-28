using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.GraphQL.Abstractions;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class CompanyType : BaseType<CompanyModel>
{
    public CompanyType() : base()
    {
        Field<NonNullGraphType<StringGraphType>>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>>()
           .Name("Email")
           .Resolve(context => context.Source.Email);
    }
}
