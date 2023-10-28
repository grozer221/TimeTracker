using FluentValidation;

using Google.Apis.Auth;

using GraphQL;
using GraphQL.Types;

using Microsoft.Net.Http.Headers;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth.DTO;

namespace TimeTracker.Server.GraphQL.Modules.Auth
{
    public class AuthMutations : ObjectGraphType
    {
        public AuthMutations(
            UserRepository userRepository,
            IAuthService authService,
            AccessTokenRepository aceessTokenRepository,
            ResetPassTokenRepository resetTokenRepository,
            IHttpContextAccessor httpContextAccessor,
            INotificationService notificationService,
            IValidator<AuthLoginInput> authLoginInputValidator,
            IValidator<AuthRegisterInput> authRegisterInputValidator,
            IValidator<AuthChangePasswordInput> authChangePasswordInputValidation,
            IValidator<AuthRequestResetPasswordInput> authRequestResetPasswordInputValidation,
            IValidator<AuthResetPasswordInput> authResetPasswordInputValidation)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Login")
                .Argument<NonNullGraphType<AuthLoginInputType>, AuthLoginInput>("AuthLoginInputType", "Argument for login User")
                .ResolveAsync(async context =>
                {
                    AuthLoginInput authLoginInput = context.GetArgument<AuthLoginInput>("AuthLoginInputType");
                    authLoginInputValidator.ValidateAndThrow(authLoginInput);
                    var user = await userRepository.GetByEmailAsync(authLoginInput.Email);
                    if (user == null || !authService.ComparePasswords(authLoginInput.Password, user.Password, user.Salt))
                        throw new Exception("Bad credentials");
                    AceessTokenModel accessToken = new AceessTokenModel
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role, user.Permissions),
                        UserId = user.Id,
                    };
                    accessToken = await aceessTokenRepository.CreateAsync(accessToken);
                    return new AuthResponse()
                    {
                        Token = accessToken.Token,
                        User = user,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("LoginGoogle")
                .Argument<NonNullGraphType<StringGraphType>, string>("GoogleJWT", "Argument for login User")
                .ResolveAsync(async context =>
                {
                    string token = context.GetArgument<string>("GoogleJWT");
                    var validateToken = await GoogleJsonWebSignature.ValidateAsync(token);

                    if (validateToken == null)
                        throw new Exception("Bad credentials");

                    var user = await userRepository.GetByEmailAsync(validateToken.Email);

                    if (user == null)
                        throw new Exception("This email don`t registered in website");

                    AceessTokenModel accessToken = new AceessTokenModel
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role, user.Permissions),
                        UserId = user.Id,
                    };

                    accessToken = await aceessTokenRepository.CreateAsync(accessToken);

                    return new AuthResponse()
                    {
                        Token = accessToken.Token,
                        User = user,
                    };
                });

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("Logout")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    await aceessTokenRepository.RemoveAsync(userId, token);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Register")
                .Argument<NonNullGraphType<AuthRegisterInputType>, AuthRegisterInput>("AuthRegisterInputType", "Argument for register User")
                .ResolveAsync(async context =>
                {
                    var users = await userRepository.GetAsync();
                    if (users.Count() > 0)
                        throw new Exception("You can not register manually. Contact an administrator");

                    AuthRegisterInput authRegisterInput = context.GetArgument<AuthRegisterInput>("AuthRegisterInputType");
                    await authRegisterInputValidator.ValidateAndThrowAsync(authRegisterInput);
                    var user = authRegisterInput.ToModel();
                    user.Password = user.Password.CreateMD5WithSalt(out var salt);
                    user.Salt = salt;
                    user.Role = Role.SuperAdmin;
                    user.Permissions = new List<Permission>();
                    user = await userRepository.CreateAsync(user);
                    AceessTokenModel token = new AceessTokenModel
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role, user.Permissions),
                        UserId = user.Id,
                    };
                    token = await aceessTokenRepository.CreateAsync(token);
                    return new AuthResponse()
                    {
                        Token = token.Token,
                        User = user,
                    };
                });

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("ChangePassword")
                .Argument<NonNullGraphType<AuthChangePasswordInputType>, AuthChangePasswordInput>("AuthChangePasswordInputType", "Argument for change User password")
                .ResolveAsync(async context =>
                {
                    var authChangePasswordInput = context.GetArgument<AuthChangePasswordInput>("AuthChangePasswordInputType");
                    authChangePasswordInputValidation.ValidateAndThrow(authChangePasswordInput);
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    var user = await userRepository.GetByIdAsync(userId);
                    if (user == null || !authService.ComparePasswords(authChangePasswordInput.OldPassword, user.Password, user.Salt))
                        throw new Exception("Bad old password");
                    user.Password = authChangePasswordInput.NewPassword.CreateMD5WithSalt(out var salt);
                    user.Salt = salt;
                    await userRepository.UpdatePasswordAsync(user.Id, user.Password, user.Salt);
                    string token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    await aceessTokenRepository.RemoveAllForUserExceptTokenAsync(user.Id, token);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Impersonate")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("UserId", "Argument for Impersonate User")
                .ResolveAsync(async context =>
                {
                    //if (!httpContextAccessor.HttpContext.IsAdministrator())
                    //    throw new ExecutionError("You do not have permissions for impersonate");
                    var impersonateUserId = context.GetArgument<Guid>("UserId");
                    var impersonateUser = await userRepository.GetByIdAsync(impersonateUserId);
                    if (impersonateUser == null)
                        throw new ExecutionError("User not found");
                    AceessTokenModel token = new AceessTokenModel
                    {
                        Token = authService.GenerateAccessToken(impersonateUser.Id, impersonateUser.Email, impersonateUser.Role, impersonateUser.Permissions),
                        UserId = impersonateUser.Id,
                    };
                    token = await aceessTokenRepository.CreateAsync(token);
                    return new AuthResponse()
                    {
                        Token = token.Token,
                        User = impersonateUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Admin);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("RequestResetPassword")
                .Argument<NonNullGraphType<AuthRequestResetPasswordInputType>, AuthRequestResetPasswordInput>("AuthRequestResetPasswordInputType", "")
                .ResolveAsync(async context =>
                {
                    var authRequestResetPasswordInput = context.GetArgument<AuthRequestResetPasswordInput>("AuthRequestResetPasswordInputType");
                    authRequestResetPasswordInputValidation.ValidateAndThrow(authRequestResetPasswordInput);
                    var user = await userRepository.GetByEmailAsync(authRequestResetPasswordInput.Email);

                    if (user != null)
                    {
                        string protocol = httpContextAccessor.HttpContext.Request.IsHttps ? "https" : "http";
                        string token = authService.GenerateResetPasswordToken(user.Id, user.Email);
                        string path = $"{protocol}://{httpContextAccessor.HttpContext.Request.Host}/auth/reset-password/{token}";
                        string msg = $"This is link for reset your password. If you don`t undestand what is it don`t do anything.\n{path}";
                        await notificationService.SendMessageAsync(user.Email, "Reset Password", msg);

                        await resetTokenRepository.RemoveAllForUserAsync(user.Id);
                        var model = new ResetPassTokenModel()
                        {
                            Token = token,
                            UserId = user.Id
                        };
                        await resetTokenRepository.CreateAsync(model);
                    }
                    return true;
                });

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("ResetPassword")
                .Argument<NonNullGraphType<AuthResetPasswordInputType>, AuthResetPasswordInput>("AuthResetPasswordInputType", "")
                .ResolveAsync(async context =>
                {
                    var authResetPasswordInput = context.GetArgument<AuthResetPasswordInput>("AuthResetPasswordInputType");
                    authResetPasswordInputValidation.ValidateAndThrow(authResetPasswordInput);
                    var userId = authService.ValidatePasswordToken(authResetPasswordInput.Token);
                    var model = await resetTokenRepository.GetByTokenAsync(authResetPasswordInput.Token);
                    if (userId == null || model == null)
                    {
                        throw new Exception("Bad token");
                    }
                    var user = await userRepository.GetByIdAsync(userId.Value);
                    user.Password = authResetPasswordInput.Password.CreateMD5WithSalt(out var salt);
                    user.Salt = salt;
                    await userRepository.UpdatePasswordAsync(user.Id, user.Password, user.Salt);
                    await resetTokenRepository.RemoveAllForUserAsync(user.Id);
                    await aceessTokenRepository.RemoveAllForUserAsync(user.Id);
                    return true;
                });
        }
    }
}
