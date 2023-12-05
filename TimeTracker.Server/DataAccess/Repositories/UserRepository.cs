using Dapper;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Models;
using TimeTracker.Business.Models.Filters;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class UserRepository
    {
        private readonly DapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserRepository(DapperContext dapperContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dapperContext = dapperContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<UserModel> GetByIdAsync(Guid id)
        {
            //var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = $"select * from Users where id = @id";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<UserModel>(query, new { id });
            }
        }

        public async Task<UserModel> GetByEmailAsync(string email)
        {
            //var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = $"select * from Users where email = @email";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<UserModel>(query, new { email });
            }
        }

        public async Task<IEnumerable<UserModel>> GetAsync()
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string query = $"select * from Users WHERE CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<UserModel>(query, new { companyId });
            }
        }

        public async Task<GetEntitiesResponse<UserModel>> GetAsync(UserFilter filter, int take, int skip)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            string email = "%" + filter.Email + "%";
            string firstname = "%" + filter.FirstName + "%";
            string lastname = "%" + filter.LastName + "%";
            string middlename = "%" + filter.MiddleName + "%";
            var allPremisions = filter.Permissions?.Select(p => p.ToString()).ToArray();
            var permissionsCount = filter.Permissions?.Count();
            var rolesNumbers = filter.Roles;
            var employments = filter.Employments;
            int skipNumber = skip * take;

            string getCountQuery = @"select count(*) from Users 
                                    where FirstName like @firstname
                                        and LastName like @lastname
                                        and MiddleName like @middlename
                                        and	Email like @email 
                                        AND CompanyId = @companyId ";

            string getEntitieQuery = @"select * FROM Users
                                        where FirstName like @firstname
                                        and LastName like @lastname
                                        and MiddleName like @middlename
                                        and	Email like @email
                                        AND CompanyId = @companyId ";


            if (filter.Roles != null && filter.Roles.Count() != 0)
            {
                getCountQuery += " and RoleNumber in @rolesNumbers ";
                getEntitieQuery += "and RoleNumber in @rolesNumbers ";
            }


            if (filter.Permissions != null && filter.Permissions.Count() != 0)
            {
                getCountQuery += @"and @permissionsCount = (select count(value) from OPENJSON(PermissionsString) where value in @allPremisions) ";
                getEntitieQuery += @"and @permissionsCount = (select count(value) from OPENJSON(PermissionsString) where value in @allPremisions) ";
            }

            if (filter.Employments != null && filter.Employments.Count() != 0)
            {
                getCountQuery += "and Employment in @employments ";
                getEntitieQuery += "and Employment in @employments ";
            }

            getEntitieQuery += @"ORDER BY Id 
                                 OFFSET @skipNumber ROWS 
                                 FETCH NEXT @take ROWS ONLY";

            using (var connection = dapperContext.CreateConnection())
            {
                var reader = await connection.QueryMultipleAsync($"{getCountQuery};{getEntitieQuery}", new
                {
                    email,
                    firstname,
                    lastname,
                    middlename,
                    take,
                    skipNumber,
                    allPremisions,
                    permissionsCount,
                    rolesNumbers,
                    employments,
                    companyId,
                });

                int total = reader.Read<int>().FirstOrDefault();
                var users = reader.Read<UserModel>();
                return new GetEntitiesResponse<UserModel>
                {
                    Entities = users,
                    Total = total,
                    PageSize = take,
                };
            }
        }

        public async Task<UserModel> CreateAsync(UserModel model)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            model.Id = Guid.NewGuid();
            model.CompanyId = model.CompanyId.GetOrDefault(companyId);
            var dateTimeNow = DateTime.Now;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into Users 
                            (Id,   Email,  Password,  Salt,  FirstName,  LastName,  MiddleName,  
                                 RoleNumber,  PermissionsString,  Employment,  CompanyId, CreatedAt,  UpdatedAt) values 
                            (@Id, @Email, @Password, @Salt, @FirstName, @LastName, @MiddleName, 
                                @RoleNumber, @PermissionsString, @Employment, @companyId, @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task UpdatePasswordAsync(Guid userId, string password, string salt)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            var previousModel = await GetByIdAsync(userId);
            if (previousModel == null)
                throw new Exception("User not found");

            string query = @"update Users
                            SET Password = @Password, Salt = @Salt
                            WHERE Id = @Id AND CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id = userId, password, salt, companyId });
            }
        }

        public async Task<UserModel> UpdateAsync(UserModel model)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            var previousModel = await GetByIdAsync(model.Id);
            if (previousModel == null)
                throw new Exception("User not found");

            model.CompanyId = model.CompanyId.GetOrDefault(companyId);
            model.UpdatedAt = DateTime.Now;
            string query = @"update Users
                            SET Email = @Email, FirstName = @FirstName, LastName = @LastName, 
                                MiddleName = @MiddleName, PermissionsString = @PermissionsString, 
                                Employment = @Employment, CompanyId = @companyId
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
            }
            return model;
        }

        public async Task<UserModel> RemoveAsync(string email)
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();

            var previousModel = await GetByEmailAsync(email);
            if (previousModel == null)
                throw new Exception("User not found");

            string query = "delete from Users where email = @email AND CompanyId = @companyId";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { email, companyId });
                return previousModel;
            }
        }
    }
}
