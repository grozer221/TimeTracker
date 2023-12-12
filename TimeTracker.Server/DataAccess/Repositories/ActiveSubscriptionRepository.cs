using Dapper;

using TimeTracker.Business.Models;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class ActiveSubscriptionRepository
    {
        private readonly DapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ActiveSubscriptionRepository(DapperContext dapperContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dapperContext = dapperContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<ActiveSubscriptionModel?> GetCurrentAsync()
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = $"select * from ActiveSubscriptions where companyId = @companyId AND DateExpire < @DateExpire";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<ActiveSubscriptionModel>(query, new { companyId, dateExpire = DateTime.UtcNow });
            }
        }

        public async Task<ActiveSubscriptionModel> GetById(Guid id)
        {
            string query = $"select * from ActiveSubscriptions where Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<ActiveSubscriptionModel>(query, new { id });
            }
        }

        public async Task<IEnumerable<UserModel>> GetExpiredAsync()
        {
            string query = $"select * from ActiveSubscriptions WHERE DateExpire < @DateExpire";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<UserModel>(query, new { DateExpire = DateTime.UtcNow });
            }
        }

        public async Task<ActiveSubscriptionModel> CreateAsync(ActiveSubscriptionModel model)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            model.Id = Guid.NewGuid();
            model.CompanyId = model.CompanyId.GetOrDefault(companyId);
            var dateTimeNow = DateTime.UtcNow;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into ActiveSubscriptions 
                            (Id,   TypeNumber,  CompanyId,  DateExpire, CreatedAt,  UpdatedAt) values 
                            (@Id, @TypeNumber, @companyId, @DateExpire, @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task<ActiveSubscriptionModel> RemoveAsync(Guid id)
        {
            var previousModel = await GetById(id);
            if (previousModel == null)
                throw new Exception("Active subscription not found");

            string query = "delete from ActiveSubscriptions where Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
                return previousModel;
            }
        }
    }
}
