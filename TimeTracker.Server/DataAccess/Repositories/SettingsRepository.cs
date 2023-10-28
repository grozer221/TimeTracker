using Dapper;

using TimeTracker.Business.Models;
using TimeTracker.Business.Models.SettingsCategories;
using TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories;

namespace TimeTracker.Server.DataAccess.Repositories
{
    public class SettingsRepository
    {
        private readonly DapperContext dapperContext;

        public SettingsRepository(DapperContext dapperContext)
        {
            this.dapperContext = dapperContext;
        }

        public async Task<SettingsModel> GetAsync()
        {
            string query = "select * from Settings";
            using (var connection = dapperContext.CreateConnection())
            {
                var settings = await connection.QueryFirstOrDefaultAsync<SettingsModel>(query);
                if (settings == null)
                {
                    string queryInsert = $@"insert into Settings 
                            ( Id,  CreatedAt,  UpdatedAt) values 
                            (@Id, @CreatedAt, @UpdatedAt)";
                    DateTime dateTimeNow = DateTime.UtcNow;
                    settings = new SettingsModel
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = dateTimeNow,
                        UpdatedAt = dateTimeNow,
                    };
                    await connection.ExecuteAsync(queryInsert, settings);
                }
                return settings;
            }
        }

        public async Task<SettingsModel> UpdateApplicationAsync(SettingsApplication settingsApplication)
        {
            var settings = await GetAsync();
            settings.Application = settingsApplication;
            settings.UpdatedAt = DateTime.UtcNow;
            string query = @"update Settings
                            SET ApplicationString = @ApplicationString, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, settings);
            }
            return settings;
        }

        public async Task<SettingsModel> UpdateEmploymentAsync(SettingsEmployment settingsEmployment)
        {
            var settings = await GetAsync();
            settings.Employment = settingsEmployment;
            settings.UpdatedAt = DateTime.UtcNow;
            string query = @"update Settings
                            SET EmploymentString = @EmploymentString, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, settings);
            }
            return settings;
        }

        public async Task<SettingsModel> UpdateTasksAsync(SettingsTasks settingsTasks)
        {
            var settings = await GetAsync();
            settings.Tasks = settingsTasks;
            settings.UpdatedAt = DateTime.Now;
            string query = @"update Settings
                            SET TasksString = @TasksString, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, settings);
            }
            return settings;
        }

        public async Task<SettingsModel> UpdateEmailAsync(SettingsEmail settingsEmail)
        {
            var settings = await GetAsync();
            settings.Email = settingsEmail;
            settings.UpdatedAt = DateTime.UtcNow;
            string query = @"update Settings
                            SET EmailString = @EmailString, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, settings);
            }
            return settings;
        }

        public async Task<SettingsModel> UpdateVacationRequestsAsync(SettingsVacationRequests settingsVacationRequests)
        {
            var settings = await GetAsync();
            settings.VacationRequests = settingsVacationRequests;
            settings.UpdatedAt = DateTime.UtcNow;
            string query = @"update Settings
                            SET VacationRequestsString = @VacationRequestsString, UpdatedAt = @UpdatedAt
                            WHERE Id = @Id";
            using (var connection = dapperContext.CreateConnection())
            {
                await connection.ExecuteAsync(query, settings);
            }
            return settings;
        }
    }
}
