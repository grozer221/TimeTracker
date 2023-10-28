using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.GraphQL.Abstractions;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class CompanyInput : IModelable<CompanyModel>
{
    public string Name { get; set; }

    public string Email { get; set; }

    public CompanyModel ToModel()
        => new()
        {
            Name = this.Name,
            Email = this.Email,
        };
}

public class CompanyInputType : InputObjectGraphType<CompanyInput>
{
    public CompanyInputType()
    {
        Field<NonNullGraphType<StringGraphType>>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>>()
           .Name("Email")
           .Resolve(context => context.Source.Email);
    }
}
