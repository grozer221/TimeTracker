using Dapper;

using System.Data;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Business.Models.Filters;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class ExcelExportRepository
    {
        private readonly DapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ExcelExportRepository(DapperContext dapperContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dapperContext = dapperContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<UserModel>> GetAsync(UserFilter filter)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            IEnumerable<UserModel> users;
            string email = "%" + filter.Email + "%";
            string firstname = "%" + filter.FirstName + "%";
            string lastname = "%" + filter.LastName + "%";
            string middlename = "%" + filter.MiddleName + "%";
            var allPremisions = filter.Permissions?.Select(p => p.ToString()).ToArray();
            var permissionsCount = filter.Permissions?.Count();
            var rolesNumbers = filter.Roles;
            var employments = filter.Employments;

            string query = @"SELECT * FROM Users WHERE FirstName like @firstname
                             and LastName like @lastname
                             and MiddleName like @middlename
                             and Email like @email 
                             and CompanyId like @CompanyId ";

            if (filter.Roles != null && filter.Roles.Count() != 0)
                query += "and RoleNumber in @rolesNumbers ";

            if (filter.Permissions != null && filter.Permissions.Count() != 0)
                query += @"and @permissionsCount = (select count(value) from OPENJSON(PermissionsString) where value in @allPremisions) ";

            if (filter.Employments != null && filter.Employments.Count() != 0)
                query += "and Employment in @employments ";

            using IDbConnection db = dapperContext.CreateConnection();
            users = await db.QueryAsync<UserModel>(query, new
            {
                email,
                firstname,
                lastname,
                middlename,
                allPremisions,
                permissionsCount,
                rolesNumbers,
                employments,
                companyId,
            });

            return users;
        }

        public async Task GetUserHours(Guid userId, DateTime date, ExcelModel model)
        {
            IEnumerable<TrackModel> tracks;
            var month = date.Month;
            var year = date.Year;

            using (var connection = dapperContext.CreateConnection())
            {
                tracks = await connection.QueryAsync<TrackModel>("SELECT * FROM Tracks WHERE UserId = @UserId AND MONTH(StartTime) = @month AND YEAR(StartTime) = @year", new { userId, month, year });
            }

            foreach (var track in tracks)
            {
                if (track.EndTime != null)
                {
                    switch (track.Kind)
                    {
                        case (TrackKind.Working):
                            var workTime = track.EndTime - track.StartTime;
                            model.WorkerHours += workTime!.Value.TotalHours;
                            break;
                        case (TrackKind.Vacation):
                            var vacationTime = track.EndTime - track.StartTime;
                            model.VacantionHours += vacationTime!.Value.TotalHours;
                            break;
                        case (TrackKind.Sick):
                            var sickTime = track.EndTime - track.StartTime;
                            model.VacantionHours += sickTime!.Value.TotalHours;
                            break;
                    }

                }
            }

        }
    }
}
