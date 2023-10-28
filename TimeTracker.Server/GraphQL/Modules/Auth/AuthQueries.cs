using GraphQL;
using GraphQL.Types;

using Microsoft.Net.Http.Headers;

using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth.DTO;

namespace TimeTracker.Server.GraphQL.Modules.Auth
{
    public class AuthQueries : ObjectGraphType
    {
        public AuthQueries(IHttpContextAccessor httpContextAccessor, UserRepository userRepository)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Me")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    return new AuthResponse()
                    {
                        Token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization],
                        User = await userRepository.GetByIdAsync(userId),
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
