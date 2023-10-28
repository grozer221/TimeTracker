using Dapper;

using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class AccessTokenRepository
    {
        private readonly DapperContext dapperContext;

        public AccessTokenRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<AceessTokenModel> GetByToken(string token)
        {
            string query = $"select * from AccessTokens where token = @token";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<AceessTokenModel>(query, new { token });
            }
        }

        public async Task<IEnumerable<AceessTokenModel>> GetByUserId(Guid userId)
        {
            string query = $"select * from AccessTokens where userId = @userId";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<AceessTokenModel>(query, new { userId });
            }
        }

        public async Task<AceessTokenModel> CreateAsync(AceessTokenModel model)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into AccessTokens 
                            (Id, Token, UserId, CreatedAt, UpdatedAt) 
                            values (@Id, @Token, @UserId, @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task RemoveAsync(Guid userId, string token)
        {
            string query = "delete from AccessTokens where userId = @userId and token = @token";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId, token });
            }
        }

        public async Task RemoveAllForUserExceptTokenAsync(Guid userId, string token)
        {
            string query = "delete from AccessTokens where userId = @userId and token != @token";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId, token });
            }
        }

        public async Task RemoveAllForUserAsync(Guid userId)
        {
            string query = "delete from AccessTokens where userId = @userId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId });
            }
        }
    }
}
