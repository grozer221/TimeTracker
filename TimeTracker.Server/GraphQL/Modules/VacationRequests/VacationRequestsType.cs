using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.EnumTypes;
using TimeTracker.Server.GraphQL.Modules.Users;

namespace TimeTracker.Server.GraphQL.Modules.VacationRequests
{
    public class VacationRequestType : BaseType<VacationRequestModel>
    {
        public VacationRequestType(IServiceProvider serviceProvider) : base()
        {
            Field<NonNullGraphType<DateGraphType>, DateTime>()
               .Name("DateStart")
               .Resolve(context => context.Source.DateStart);

            Field<NonNullGraphType<DateGraphType>, DateTime>()
               .Name("DateEnd")
               .Resolve(context => context.Source.DateEnd);

            Field<StringGraphType, string?>()
               .Name("Comment")
               .Resolve(context => context.Source.Comment);

            Field<NonNullGraphType<VacationRequestStatusType>, VacationRequestStatus>()
               .Name("Status")
               .Resolve(context => context.Source.Status);

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
        }
    }
}
