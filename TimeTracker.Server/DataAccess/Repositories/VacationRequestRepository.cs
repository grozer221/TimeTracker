using Dapper;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Filters;
using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class VacationRequestRepository
    {
        private readonly DapperContext dapperContext;

        public VacationRequestRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<VacationRequestModel> GetByIdAsync(Guid id)
        {
            string query = @"select * from VacationRequests where id = @id";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<VacationRequestModel>(query, new { id });
            }
        }

        public async Task<VacationRequestModel> GetByDateAsync(DateTime date, Guid userId)
        {
            string query = @"select * from VacationRequests
                            where userId = @userId and @date between DateStart and DateEnd";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<VacationRequestModel>(query, new { date, userId });
            }
        }

        public async Task<IEnumerable<VacationRequestModel>> GetAsync(Guid userId, DateTime from, DateTime to)
        {
            string query = @"select top 1 * from VacationRequests 
                            where userId = @userId and DateStart between @from and @to";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<VacationRequestModel>(query, new { userId, from, to });
            }
        }

        public async Task<GetEntitiesResponse<VacationRequestModel>> GetAsync(int pageNumber, int pageSize, VacationRequestsFilter filter, Guid currentUserId)
        {
            string query = @"select {0} from VacationRequests";

            var wheres = new List<string>();
            if (filter.Statuses.Count() > 0)
                wheres.Add("status in @statuses");
            if (filter.UserIds.Count() > 0)
                wheres.Add("userId in @userIds");

            switch (filter.Kind)
            {
                case VacationRequestsFilterKind.CanApprove:
                    wheres.Add(@"userId in 
	                            (select userId from Users_UsersWhichCanApproveVacationRequests 
	                            join Users on Users_UsersWhichCanApproveVacationRequests.UserWhichCanApproveVacationRequestId = Users.Id
	                            where userWhichCanApproveVacationRequestId = @currentUserId)");
                    break;
                case VacationRequestsFilterKind.Mine:
                    wheres.Add(@"userId = @currentUserId");
                    break;
                case VacationRequestsFilterKind.All:
                default:
                    break;
            }

            if (wheres.Count > 0)
                query += @" where " + string.Join(" and ", wheres);

            string getCountQuery = string.Format(query, "count(*)");
            string getEntitiesQuery = string.Format(query, "*");

            getEntitiesQuery += @" ORDER BY DateStart desc
                                    OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

            int skip = (pageNumber - 1) * pageSize;
            using (var connection = dapperContext.CreateConnection())
            {
                var reader = await connection.QueryMultipleAsync($"{getCountQuery};{getEntitiesQuery}", new
                {
                    skip,
                    take = pageSize,
                    statuses = filter.Statuses,
                    userIds = filter.UserIds,
                    currentUserId,
                });
                int total = reader.Read<int>().FirstOrDefault();
                var entities = reader.Read<VacationRequestModel>();
                return new GetEntitiesResponse<VacationRequestModel>
                {
                    Entities = entities,
                    Total = total,
                    PageSize = pageSize,
                };
            }
        }

        public async Task<VacationRequestModel> CreateAsync(VacationRequestModel model)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.UtcNow;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into VacationRequests 
                            (Id,   DateStart,  DateEnd,  Comment,  Status,  UserId,  CreatedAt,  UpdatedAt) values 
                            (@Id, @DateStart, @DateEnd, @Comment, @Status, @UserId, @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task<VacationRequestModel> UpdateAsync(VacationRequestModel model)
        {
            model.UpdatedAt = DateTime.UtcNow;
            string query = @"update VacationRequests
                            SET DateStart = @DateStart, DateEnd = @DateEnd, Comment = @Comment, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
            }
            return model;
        }

        public async Task UpdateStatusAsync(Guid id, VacationRequestStatus status)
        {
            string query = @"update VacationRequests
                            SET Status = @Status, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id, status, updatedAt = DateTime.UtcNow });
            }
        }

        public async Task RemoveAsync(Guid id)
        {
            string query = "delete from VacationRequests where id = @id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }
    }
}
