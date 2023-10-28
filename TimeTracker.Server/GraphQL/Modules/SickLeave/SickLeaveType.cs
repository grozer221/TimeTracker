using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.Modules.Users;

namespace TimeTracker.Server.GraphQL.Modules.SickLeave
{
    public class SickLeaveType : BaseType<SickLeaveModel>
    {
        public SickLeaveType(IServiceProvider serviceProvider) : base()
        {
            Field<NonNullGraphType<DateGraphType>, DateTime>()
               .Name("StartDate")
               .Resolve(context => context.Source.StartDate);

            Field<NonNullGraphType<DateGraphType>, DateTime>()
               .Name("EndDate")
               .Resolve(context => context.Source.EndDate);

            Field<StringGraphType, string?>()
               .Name("Comment")
               .Resolve(context => context.Source.Comment);

            Field<NonNullGraphType<GuidGraphType>, Guid>()
               .Name("UserId")
               .Resolve(context => context.Source.UserId);

            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("User")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
                   var userId = context.Source.UserId;
                   return await userRepository.GetByIdAsync(userId);
               });

            Field<NonNullGraphType<ListGraphType<StringGraphType>>, IEnumerable<string>>()
               .Name("Files")
               .Resolve(context => context.Source.Files);
        }
    }
}
