using Dapper;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Models;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class CompanyRepository
    {
        private readonly DapperContext dapperContext;

        public CompanyRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<CompanyModel?> GetByIdAsync(Guid id)
        {
            string query = @"select * from Companies where id = @id";
            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryFirstOrDefaultAsync<CompanyModel>(query, new { id });
            }
        }

        public async Task<GetEntitiesResponse<CompanyModel>> GetAsync(int pageNumber, int pageSize)
        {
            string query = @"select {0} from Companies";

            string getCountQuery = string.Format(query, "count(*)");
            string getEntitiesQuery = string.Format(query, "*");

            getEntitiesQuery += @" ORDER BY Name asc
                                    OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

            int skip = (pageNumber - 1) * pageSize;
            using (var connection = dapperContext.CreateConnection())
            {
                var reader = await connection.QueryMultipleAsync($"{getCountQuery};{getEntitiesQuery}", new
                {
                    skip,
                    take = pageSize,
                });
                int total = reader.Read<int>().FirstOrDefault();
                var entities = reader.Read<CompanyModel>();
                return new GetEntitiesResponse<CompanyModel>
                {
                    Entities = entities,
                    Total = total,
                    PageSize = pageSize,
                };
            }
        }

        public async Task<IEnumerable<CompanyModel>> GetAsync()
        {
            string query = @"select * from Companies";

            using (var connection = dapperContext.CreateConnection())
            {
                return await connection.QueryAsync<CompanyModel>(query);
            }
        }

        public async Task<CompanyModel> CreateAsync(CompanyModel model)
        {
            model.Id = Guid.NewGuid();
            var dateTimeNow = DateTime.UtcNow;
            model.CreatedAt = dateTimeNow;
            model.UpdatedAt = dateTimeNow;
            string query = $@"insert into Companies 
                            (Id,   Name, Email,  CreatedAt,  UpdatedAt) values 
                            (@Id, @Name, @Email, @CreatedAt, @UpdatedAt)";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
                return model;
            }
        }

        public async Task<CompanyModel> UpdateAsync(CompanyModel model)
        {
            model.UpdatedAt = DateTime.UtcNow;
            string query = @"update Companies
                            SET Name = @Name, Email = @Email, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, model);
            }
            return model;
        }

        public async Task RemoveAsync(Guid id)
        {
            string query = "delete from Companies where id = @id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }
    }
}
