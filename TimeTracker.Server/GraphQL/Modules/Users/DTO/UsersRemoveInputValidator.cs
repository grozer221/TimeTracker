﻿using FluentValidation;
using TimeTracker.Business.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.Users.DTO
{
    public class UsersRemoveInputValidator : AbstractValidator<UsersRemoveInput>
    {
        public UsersRemoveInputValidator(IUserRepository userRepository)
        {
            RuleFor(l => l.Email)
                .EmailAddress()
                .NotEmpty()
                .NotNull()
                .MustAsync(async (user, email, cancellation) =>
                {
                    return await userRepository.GetByEmailAsync(user.Email) != null;
                }).WithMessage("User with this email does not exists");
        }
    }
}
