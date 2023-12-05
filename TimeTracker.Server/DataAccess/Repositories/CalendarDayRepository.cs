using Dapper;

using System.Data;

using TimeTracker.Business.Models;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class CalendarDayRepository
    {
        private readonly DapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public CalendarDayRepository(DapperContext dapperContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dapperContext = dapperContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<CalendarDayModel> GetByDateAsync(DateTime date)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = @"select * from CalendarDays where Date = @date AND CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<CalendarDayModel>(query, new { date, companyId });
            }
        }

        public async Task<CalendarDayModel> CreateAsync(CalendarDayModel model, IDbConnection connection, IDbTransaction transaction = null)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            model.Id = Guid.NewGuid();
            model.CompanyId = model.CompanyId.GetOrDefault(companyId);
            var dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = @"insert into CalendarDays 
                            ( Id,  Title,  Date,  Kind,  WorkHours,  CompanyId,  CreatedAt,  UpdatedAt) values 
                            (@Id, @Title, @Date, @Kind, @WorkHours, @companyId, @CreatedAt, @UpdatedAt)";
            await connection.ExecuteAsync(query, model, transaction);
            return model;
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync(DateTime from, DateTime to)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = @"select * from CalendarDays
                            where Date between @from and @to AND CompanyId = @companyId";
            string fromString = from.ToString("MM/dd/yyyy");
            string toString = to.ToString("MM/dd/yyyy");
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<CalendarDayModel>(query, new
                {
                    from = fromString,
                    to = toString,
                    companyId,
                });
            }
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync()
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = $"select * from CalendarDays WHERE CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<CalendarDayModel>(query, new { companyId });
            }
        }

        public async Task<CalendarDayModel> CreateAsync(CalendarDayModel model)
        {
            using (var connection = dapperContext.CreateConnection())
            {
                return await CreateAsync(model, connection);
            }
        }

        public async Task<CalendarDayModel> UpdateAsync(CalendarDayModel model)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            var previousModel = await GetByDateAsync(model.Date);
            if (previousModel == null)
                throw new Exception("Calendar day not found");

            model.CompanyId = model.CompanyId.GetOrDefault(companyId);
            model.UpdatedAt = DateTime.Now;
            string query = @"update CalendarDays
                            SET Title = @Title, Date = @Date, Kind = @Kind, 
                                WorkHours = @WorkHours, CompanyId = @companyId, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
            }
            return model;
        }

        public async Task<CalendarDayModel> RemoveAsync(DateTime date)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            var previousModel = await GetByDateAsync(date);
            if (previousModel == null)
                throw new Exception("Calendar day not found");

            string query = "delete from CalendarDays where Date = @date AND CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { date, companyId });
                return previousModel;
            }
        }
    }
}
