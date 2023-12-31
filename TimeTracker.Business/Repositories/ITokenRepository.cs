﻿using TimeTracker.Business.Models;

namespace TimeTracker.Business.Repositories
{
    public interface ITokenRepository
    {
        Task<TokenModel> CreateAsync(TokenModel model);
        Task<IEnumerable<TokenModel>> GetByUserId(Guid userId);
        Task<TokenModel> GetByToken(string token);
        Task RemoveAsync(Guid userId, string token);
        Task RemoveAllForUserExceptTokenAsync(Guid userId, string token);
    }
}
