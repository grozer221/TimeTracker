using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Abstraction;
using TimeTracker.Server.GraphQL.Modules.Auth;

namespace TimeTracker.Server.GraphQL.Modules.Cache
{
    public class CacheMutations : ObjectGraphType
    {
        public CacheMutations(IHttpContextAccessor httpContextAccessor, IEnumerable<IManager> managers)
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RefreshApp")
               .Resolve(context =>
               {
                   //if (!httpContextAccessor.HttpContext.IsAdministrator())
                   //    throw new ExecutionError("You do not have permissions for clear cache");
                   foreach (var manager in managers)
                       manager.ResetCache();
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Admin);
        }
    }
}
