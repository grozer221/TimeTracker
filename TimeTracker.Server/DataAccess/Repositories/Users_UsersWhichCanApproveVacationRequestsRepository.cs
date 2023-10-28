using Dapper;

using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class Users_UsersWhichCanApproveVacationRequestsRepository
    {
        private readonly DapperContext dapperContext;

        public Users_UsersWhichCanApproveVacationRequestsRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<IEnumerable<UserModel>> GetUsersWhichCanApproveVacationRequests(Guid forUserId)
        {
            string query = @"select * from Users_UsersWhichCanApproveVacationRequests 
                                join Users on Users_UsersWhichCanApproveVacationRequests.UserWhichCanApproveVacationRequestId = Users.Id
                                where UserId = @UserId";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<UserModel, UserModel, UserModel>(query, (a, b) => b, new { userId = forUserId });
            }
        }

        public async Task<Users_UsersWhichCanApproveVacationRequests> CreateUsersWhichCanApproveVacationRequests(Users_UsersWhichCanApproveVacationRequests model)
        {
            model.Id = Guid.NewGuid();
            DateTime dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into Users_UsersWhichCanApproveVacationRequests 
                            (Id,   UserId,  UserWhichCanApproveVacationRequestId,   CreatedAt,  UpdatedAt) values 
                            (@Id, @UserId, @UserWhichCanApproveVacationRequestId,  @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task RemoveUsersWhichCanApproveVacationRequests(Guid forUserId)
        {
            string query = "delete from Users_UsersWhichCanApproveVacationRequests where userId = @userId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { userId = forUserId });
            }
        }
    }
}
