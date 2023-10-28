using Dapper;

using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class ResetPassTokenRepository
    {
        private readonly DapperContext dapperContext;

        public ResetPassTokenRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<ResetPassTokenModel> GetByTokenAsync(string token)
        {
            string query = $"select * from ResetPassTokens where token = @token";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<ResetPassTokenModel>(query, new { token });
            }
        }

        public async Task<ResetPassTokenModel> CreateAsync(ResetPassTokenModel model)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into ResetPassTokens 
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
            string query = "delete from ResetPassTokens where userId = @userId and token = @token";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId, token });
            }
        }

        public async Task RemoveAllForUserAsync(Guid userId)
        {
            string query = "delete from ResetPassTokens where userId = @userId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId });
            }
        }
    }
}
