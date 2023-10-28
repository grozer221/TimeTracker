using Dapper;

using System.Data;

using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class CalendarDayRepository
    {
        private readonly DapperContext dapperContext;

        public CalendarDayRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<CalendarDayModel> GetByDateAsync(DateTime date)
        {
            string query = @"select * from CalendarDays where Date = @date";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<CalendarDayModel>(query, new { date });
            }
        }

        public static async Task<CalendarDayModel> CreateAsync(CalendarDayModel model, IDbConnection connection, IDbTransaction transaction = null)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = @"insert into CalendarDays 
                            ( Id,  Title,  Date,  Kind,  WorkHours,  CreatedAt,  UpdatedAt) values 
                            (@Id, @Title, @Date, @Kind, @WorkHours, @CreatedAt, @UpdatedAt)";
            await connection.ExecuteAsync(query, model, transaction);
            return model;
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync(DateTime from, DateTime to)
        {
            string query = @"select * from CalendarDays
                            where Date between @from and @to";
            string fromString = from.ToString("MM/dd/yyyy");
            string toString = to.ToString("MM/dd/yyyy");
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<CalendarDayModel>(query, new { from = fromString, to = toString });
            }
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync()
        {
            string query = $"select * from CalendarDays";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<CalendarDayModel>(query);
            }
        }

        public async Task<CalendarDayModel> CreateAsync(CalendarDayModel model)
        {
            using (var connection = dapperContext.CreateConnection())
            {
                return await CalendarDayRepository.CreateAsync(model, connection);
            }
        }

        public async Task<CalendarDayModel> UpdateAsync(CalendarDayModel model)
        {
            var previousModel = await GetByDateAsync(model.Date);
            if (previousModel == null)
                throw new Exception("Calendar day not found");
            model.UpdatedAt = DateTime.Now;
            string query = @"update CalendarDays
                            SET Title = @Title, Date = @Date, Kind = @Kind, 
                                WorkHours = @WorkHours, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
            }
            return model;
        }

        public async Task<CalendarDayModel> RemoveAsync(DateTime date)
        {
            var previousModel = await GetByDateAsync(date);
            if (previousModel == null)
                throw new Exception("Calendar day not found");
            string query = "delete from CalendarDays where Date = @date";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { date });
                return previousModel;
            }
        }
    }
}
