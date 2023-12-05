using Microsoft.Extensions.Caching.Memory;

using TimeTracker.Business.Abstraction;
using TimeTracker.Business.Models;
using TimeTracker.Business.Models.SettingsCategories;
using TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.DataAccess.Managers
{
    public class SettingsManager : IManager
    {
        public const string GetAsyncKey = "GetAsyncKey/{0}";
        private readonly IMemoryCache memoryCache;
        private readonly SettingsRepository settingsRepository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public SettingsManager(
            IMemoryCache memoryCache,
            SettingsRepository settingsRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            this.memoryCache = memoryCache;
            this.settingsRepository = settingsRepository;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<SettingsModel> GetAsync()
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();
            var key = string.Format(GetAsyncKey, companyId);

            return await memoryCache.GetOrCreateAsync(key, async cacheEntry =>
            {
                cacheEntry.SetOptions(CachingContext.MemoryCacheEntryOptionsWeek1);
                return await settingsRepository.GetAsync();
            });
        }

        public async Task<SettingsModel> UpdateApplicationAsync(SettingsApplication settingsApplication)
        {
            await ResetCache();
            return await settingsRepository.UpdateApplicationAsync(settingsApplication);
        }

        public async Task<SettingsModel> UpdateEmploymentAsync(SettingsEmployment settingsEmployment)
        {
            await ResetCache();
            return await settingsRepository.UpdateEmploymentAsync(settingsEmployment);
        }

        public async Task<SettingsModel> UpdateTasksAsync(SettingsTasks settingsTasks)
        {
            await ResetCache();
            return await settingsRepository.UpdateTasksAsync(settingsTasks);
        }

        public async Task<SettingsModel> UpdateEmailAsync(SettingsEmail settingsEmail)
        {
            await ResetCache();
            return await settingsRepository.UpdateEmailAsync(settingsEmail);
        }

        public async Task<SettingsModel> UpdateVacationRequestsAsync(SettingsVacationRequests settingsVacationRequests)
        {
            await ResetCache();
            return await settingsRepository.UpdateVacationRequestsAsync(settingsVacationRequests);
        }

        public async Task ResetCache()
        {
            var companyId = httpContextAccessor.HttpContext.GetCompanyId();
            memoryCache.Remove(string.Format(GetAsyncKey, companyId));
        }
    }
}
