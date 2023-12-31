﻿using GraphQL;
using GraphQL.Types;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using TimeTracker.Server.GraphQL.Modules.Auth.DTO;
using TimeTracker.Server.Services;
using TimeTracker.Server.Extensions;
using Microsoft.Net.Http.Headers;
using FluentValidation;
using TimeTracker.Server.Abstractions;

namespace TimeTracker.Server.GraphQL.Modules.Auth
{
    public class AuthMutations : ObjectGraphType
    {
        public AuthMutations(
            IUserRepository userRepository, 
            IAuthService authService, 
            ITokenRepository tokenRepository, 
            IHttpContextAccessor httpContextAccessor,
            IValidator<AuthLoginInput> authLoginInputValidator,
            IValidator<AuthRegisterInput> authRegisterInputValidator,
            IValidator<AuthChangePasswordInput> authChangePasswordInputValidation)
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
                    TokenModel token = new TokenModel
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role, user.Permissions),
                        UserId = user.Id,
                    };
                    token = await tokenRepository.CreateAsync(token);
                    return new AuthResponse()
                    {
                        Token = token.Token,
                        User = user,
                    };
                });
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("Logout")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    await tokenRepository.RemoveAsync(userId, token);
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
                    user.Role = Role.Administrator;
                    user.Permissions = new List<Permission>();
                    user = await userRepository.CreateAsync(user);
                    TokenModel token = new TokenModel
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role, user.Permissions),
                        UserId = user.Id,
                    };
                    token = await tokenRepository.CreateAsync(token);
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
                    await tokenRepository.RemoveAllForUserExceptTokenAsync(user.Id, token);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Impersonate")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("UserId", "Argument for Impersonate User")
                .ResolveAsync(async context =>
                {
                    if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.Impersonate))
                        throw new ExecutionError("You do not have permissions for impersonate");
                    var impersonateUserId = context.GetArgument<Guid>("UserId");
                    var impersonateUser = await userRepository.GetByIdAsync(impersonateUserId);
                    if (impersonateUser == null)
                        throw new ExecutionError("User not found");
                    TokenModel token = new TokenModel
                    {
                        Token = authService.GenerateAccessToken(impersonateUser.Id, impersonateUser.Email, impersonateUser.Role, impersonateUser.Permissions),
                        UserId = impersonateUser.Id,
                    };
                    token = await tokenRepository.CreateAsync(token);
                    return new AuthResponse()
                    {
                        Token = token.Token,
                        User = impersonateUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
