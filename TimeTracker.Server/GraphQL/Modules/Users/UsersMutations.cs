using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Users.DTO;

namespace TimeTracker.Server.GraphQL.Modules.Users
{
    public class UsersMutations : ObjectGraphType
    {
        public UsersMutations(
            UserRepository userRepository,
            Users_UsersWhichCanApproveVacationRequestsRepository users_UsersWhichCanApproveVacationRequestsRepository,
            IHttpContextAccessor httpContextAccessor,
            AccessTokenRepository aceessTokenRepository,
            IValidator<UsersCreateInput> usersCreateInputValidator,
            IValidator<UsersUpdateInput> usersUpdateInputValidator,
            IValidator<UsersRemoveInput> usersRemoveInputValidator,
            IValidator<UsersUpdatePasswordInput> usersUpdatePasswordValidator
            )
        {
            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("Create")
               .Argument<NonNullGraphType<UsersCreateInputType>, UsersCreateInput>("UsersCreateInputType", "Argument for create user")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateUsers))
                       throw new ExecutionError("You do not have permissions for create user");

                   var usersCreateInput = context.GetArgument<UsersCreateInput>("UsersCreateInputType");
                   await usersCreateInputValidator.ValidateAndThrowAsync(usersCreateInput);
                   var user = usersCreateInput.ToModel();
                   user.Password = user.Password.CreateMD5WithSalt(out var salt);
                   user.Salt = salt;
                   user = await userRepository.CreateAsync(user);
                   foreach (var userWhichCanApproveVacationRequestId in usersCreateInput.UsersWhichCanApproveVacationRequestIds)
                   {
                       var userWhichCanApproveVacationRequest = new Users_UsersWhichCanApproveVacationRequests
                       {
                           UserId = user.Id,
                           UserWhichCanApproveVacationRequestId = userWhichCanApproveVacationRequestId,
                       };
                       await users_UsersWhichCanApproveVacationRequestsRepository.CreateUsersWhichCanApproveVacationRequests(userWhichCanApproveVacationRequest);
                   }
                   return user;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("Update")
               .Argument<NonNullGraphType<UsersUpdateInputType>, UsersUpdateInput>("UsersUpdateInputType", "Argument for update user")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateUsers))
                       throw new ExecutionError("You do not have permissions for update user");
                   var usersUpdateInput = context.GetArgument<UsersUpdateInput>("UsersUpdateInputType");
                   await usersUpdateInputValidator.ValidateAndThrowAsync(usersUpdateInput);
                   var user = usersUpdateInput.ToModel();
                   user = await userRepository.UpdateAsync(user);
                   await users_UsersWhichCanApproveVacationRequestsRepository.RemoveUsersWhichCanApproveVacationRequests(user.Id);
                   foreach (var userWhichCanApproveVacationRequestId in usersUpdateInput.UsersWhichCanApproveVacationRequestIds)
                   {
                       var userWhichCanApproveVacationRequest = new Users_UsersWhichCanApproveVacationRequests
                       {
                           UserId = user.Id,
                           UserWhichCanApproveVacationRequestId = userWhichCanApproveVacationRequestId,
                       };
                       await users_UsersWhichCanApproveVacationRequestsRepository.CreateUsersWhichCanApproveVacationRequests(userWhichCanApproveVacationRequest);
                   }
                   return user;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("UpdatePassword")
               .Argument<NonNullGraphType<UsersUpdatePasswordInputType>, UsersUpdatePasswordInput>("UsersUpdatePasswordInputType", "Arguments for update password for user")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateUsers))
                       throw new ExecutionError("You do not have permissions for update password");
                   var usersUpdateInput = context.GetArgument<UsersUpdatePasswordInput>("UsersUpdatePasswordInputType");
                   await usersUpdatePasswordValidator.ValidateAndThrowAsync(usersUpdateInput);
                   var user = await userRepository.GetByIdAsync(usersUpdateInput.Id);
                   user.Password = usersUpdateInput.Password.CreateMD5WithSalt(out var salt);
                   user.Salt = salt;
                   await userRepository.UpdatePasswordAsync(user.Id, user.Password, user.Salt);
                   await aceessTokenRepository.RemoveAllForUserAsync(user.Id);

                   return user;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("Remove")
               .Argument<NonNullGraphType<UsersRemoveInputType>, UsersRemoveInput>("UsersRemoveInputType", "Argument for remove user")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateUsers))
                       throw new ExecutionError("You do not have permissions for remove user");
                   var usersRemoveInput = context.GetArgument<UsersRemoveInput>("UsersRemoveInputType");
                   await usersRemoveInputValidator.ValidateAndThrowAsync(usersRemoveInput);
                   var user = await userRepository.GetByEmailAsync(usersRemoveInput.Email);
                   await users_UsersWhichCanApproveVacationRequestsRepository.RemoveUsersWhichCanApproveVacationRequests(user.Id);
                   return await userRepository.RemoveAsync(usersRemoveInput.Email);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
