using GraphQL.Types;

namespace TimeTracker.Server.GraphQL.Abstractions;

public class Paging
{
    public int PageNumber { get; set; }

    public int PageSize { get; set; }
}

public class PagingType : InputObjectGraphType<Paging>
{
    public PagingType()
    {
        Field<NonNullGraphType<IntGraphType>, int>()
             .Name("PageNumber")
             .Resolve(context => context.Source.PageNumber);

        Field<NonNullGraphType<IntGraphType>, int>()
             .Name("PageSize")
             .Resolve(context => context.Source.PageSize);
    }
}
