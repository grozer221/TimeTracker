using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Models;
using TimeTracker.Business.Models.Filters;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Users.DTO;

namespace TimeTracker.Server.GraphQL.Modules.Users
{
    public class UsersQueries : ObjectGraphType
    {
        public UsersQueries(UserRepository userRepository)
        {
            Field<NonNullGraphType<GetEntitiesResponseType<UserType, UserModel>>, GetEntitiesResponse<UserModel>>()
               .Name("Get")
               .Argument<NonNullGraphType<UserFilterType>, UserFilter>("Filter", "Filter for a search by multiple parameters")
               .Argument<NonNullGraphType<IntGraphType>, int>("Take", "Argument represent count of tracks on page")
               .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "Argument represnt page number")
               .ResolveAsync(async context =>
               {
                   var filter = context.GetArgument<UserFilter>("Filter");
                   var take = context.GetArgument<int>("Take");
                   var skip = context.GetArgument<int>("Skip");
                   return await userRepository.GetAsync(filter, take, skip);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("GetById")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "Id of user")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("Id");
                    var user = await userRepository.GetByIdAsync(id);
                    if (user == null)
                        throw new ExecutionError("User not found");
                    return user;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);


            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("GetByEmail")
                .Argument<NonNullGraphType<StringGraphType>, string>("Email", "Email of user")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("Email");
                    var user = await userRepository.GetByEmailAsync(email);
                    if (user == null)
                        throw new ExecutionError("User not found");
                    return user;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

        }
    }
}
