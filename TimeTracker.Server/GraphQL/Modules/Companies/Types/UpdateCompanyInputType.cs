using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.GraphQL.Abstractions;

namespace TimeTracker.Server.GraphQL.Modules.Companies.Types;

public class UpdateCompanyInput : IModelable<CompanyModel>
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public CompanyModel ToModel()
        => new()
        {
            Id = this.Id,
            Name = this.Name,
            Email = this.Email,
        };
}

public class UpdateCompanyInputType : InputObjectGraphType<UpdateCompanyInput>
{
    public UpdateCompanyInputType()
    {
        Field<NonNullGraphType<GuidGraphType>>()
           .Name("Id")
           .Resolve(context => context.Source.Id);

        Field<NonNullGraphType<StringGraphType>>()
           .Name("Name")
           .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>>()
           .Name("Email")
           .Resolve(context => context.Source.Email);
    }
}
