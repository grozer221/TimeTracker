using Dapper;

using System.Data;

using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class CompletedTaskRepository
    {
        private readonly DapperContext dapperContext;

        public CompletedTaskRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<CompletedTaskModel?> GetLastExecutedAsync(string name)
        {
            string query = @"select top 1 * from CompletedTasks where Name = @Name order by CreatedAt desc";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<CompletedTaskModel>(query, new { name });
            }
        }

        public static async Task<CompletedTaskModel> CreateAsync(IDbConnection connection, CompletedTaskModel model, IDbTransaction transaction = null)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.UtcNow;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = @"insert into CompletedTasks 
                                (Id,   DateExecute,  Name,  CreatedAt,  UpdatedAt) values 
                                (@Id, @DateExecute, @Name, @CreatedAt, @UpdatedAt)";
            await connection.ExecuteAsync(query, model, transaction);
            return model;
        }

        public async Task<CompletedTaskModel> CreateAsync(CompletedTaskModel model)
        {
            using (var connection = dapperContext.CreateConnection())
            {
                return await CompletedTaskRepository.CreateAsync(connection, model);
            }
        }
    }
}
