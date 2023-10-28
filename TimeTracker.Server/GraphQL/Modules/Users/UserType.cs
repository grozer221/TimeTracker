using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.EnumTypes;

namespace TimeTracker.Server.GraphQL.Modules.Users
{
    public class UserType : BaseType<UserModel>
    {
        public UserType(IServiceProvider serviceProvider) : base()
        {
            Field<StringGraphType, string>()
               .Name("FirstName")
               .Resolve(context => context.Source.FirstName);

            Field<StringGraphType, string>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);

            Field<StringGraphType, string>()
               .Name("MiddleName")
               .Resolve(context => context.Source.MiddleName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<NonNullGraphType<RoleType>, Role>()
               .Name("Role")
               .Resolve(context => context.Source.Role);

            Field<NonNullGraphType<ListGraphType<PermissionType>>, IEnumerable<Permission>?>()
               .Name("Permissions")
               .Resolve(context => context.Source.Permissions);

            Field<EmploymentType, Employment>()
               .Name("Employment")
               .Resolve(context => context.Source.Employment);

            Field<NonNullGraphType<ListGraphType<UserType>>, IEnumerable<UserModel>>()
               .Name("UsersWhichCanApproveVacationRequest")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var users_UsersWhichCanApproveVacationRequestsRepository = scope.ServiceProvider.GetRequiredService<Users_UsersWhichCanApproveVacationRequestsRepository>();
                   var userId = context.Source.Id;
                   return await users_UsersWhichCanApproveVacationRequestsRepository.GetUsersWhichCanApproveVacationRequests(userId);
               });
        }
    }

}
