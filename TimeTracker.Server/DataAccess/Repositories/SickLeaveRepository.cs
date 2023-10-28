using Dapper;

using Newtonsoft.Json;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Filters;
using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class SickLeaveRepository
    {
        private readonly DapperContext dapperContext;
        public SickLeaveRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<SickLeaveModel> CreateAsync(SickLeaveModel model)
        {
            model.CreatedAt = DateTime.Now;
            model.UpdatedAt = DateTime.Now;
            model.Id = Guid.NewGuid();

            using var db = dapperContext.CreateConnection();

            await db.ExecuteAsync(@"INSERT INTO SickLeave 
                            (Id, StartDate, EndDate, Comment, UserId, CreatedAt, UpdatedAt) VALUES 
                            (@Id, @StartDate, @EndDate, @Comment, @UserId, @CreatedAt, @UpdatedAt)", model);
            return model;
        }

        public async Task<IEnumerable<SickLeaveModel>> GetAsync(Guid userId, DateTime from, DateTime to)
        {
            string query = @"SELECT * FROM SickLeave 
                            WHERE userId = @userId AND DateStart BETWEEN @from AND @to";

            using var db = dapperContext.CreateConnection();

            return await db.QueryAsync<SickLeaveModel>(query, new { userId, from, to });
        }

        public async Task<GetEntitiesResponse<SickLeaveModel>> GetAsync(int pageNumber, int pageSize, SickLeaveFilter filter, Guid userId)
        {
            IEnumerable<SickLeaveModel> models;
            int skip = (pageNumber - 1) * pageSize;
            string query = "";
            var total = 0;

            using var db = dapperContext.CreateConnection();

            if (filter.Kind == SickLeaveFilterKind.All)
            {
                query = "SELECT * FROM SickLeave ORDER BY StartDate DESC OFFSET @skip ROWS FETCH NEXT @pageSize ROWS ONLY";
                total = await db.QueryFirstOrDefaultAsync<int>("SELECT COUNT(*) FROM SickLeave");
            }
            else if (filter.Kind == SickLeaveFilterKind.Mine)
            {
                query = "SELECT * FROM SickLeave WHERE userId = @userId ORDER BY StartDate DESC OFFSET @skip ROWS FETCH NEXT @pageSize ROWS ONLY";
                total = await db.QueryFirstOrDefaultAsync<int>("SELECT COUNT(*) FROM SickLeave WHERE userId = @userId", new { userId });
            }

            models = await db.QueryAsync<SickLeaveModel>(query, new { skip, pageSize, userId });


            return new GetEntitiesResponse<SickLeaveModel>
            {
                Entities = models,
                PageSize = pageSize,
                Total = total
            };
        }

        public async Task<SickLeaveModel> GetByIdAsync(Guid id)
        {
            using var db = dapperContext.CreateConnection();
            var model = await db.QueryFirstOrDefaultAsync<SickLeaveModel>("SELECT * FROM SickLeave WHERE Id = @Id", new { id });

            return model;
        }

        public async Task<SickLeaveModel> GetByDateAsync(DateTime date, Guid userId)
        {
            string query = @"select * from SickLeave
                            where userId = @userId and @date between StartDate and EndDate";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<SickLeaveModel>(query, new { date, userId });
            }
        }

        public async Task RemoveAsync(Guid id)
        {
            using var db = dapperContext.CreateConnection();
            var model = await db.QueryFirstOrDefaultAsync<SickLeaveModel>("DELETE FROM SickLeave WHERE Id = @Id", new { id });
        }

        public async Task<SickLeaveModel> UpdateAsync(SickLeaveModel model)
        {
            model.UpdatedAt = DateTime.Now;
            string query = @"UPDATE SickLeave SET StartDate = @StartDate, EndDate = @EndDate, 
                             Comment = @Comment, UpdatedAt = @UpdatedAt WHERE Id = @Id";

            using var db = dapperContext.CreateConnection();
            await db.QueryAsync<TrackModel>(query, model);
            return model;
        }

        public async Task UpdateFilesAsync(Guid id, IEnumerable<string> files)
        {
            string query = @"update SickLeave
                            SET FilesString = @FilesString
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id, filesString = JsonConvert.SerializeObject(files) });
            }
        }
    }
}
