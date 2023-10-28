using Microsoft.Extensions.Caching.Memory;

using TimeTracker.Business.Abstraction;
using TimeTracker.Business.Models;
using TimeTracker.Business.Models.SettingsCategories;
using TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.DataAccess.Managers
{
    public class SettingsManager : IManager
    {
        public const string GetAsyncKey = "GetAsyncKey";
        private readonly IMemoryCache memoryCache;
        private readonly SettingsRepository settingsRepository;

        public SettingsManager(IMemoryCache memoryCache, SettingsRepository settingsRepository)
        {
            this.memoryCache = memoryCache;
            this.settingsRepository = settingsRepository;
        }

        public async Task<SettingsModel> GetAsync()
        {
            return await memoryCache.GetOrCreateAsync(GetAsyncKey, async cacheEntry =>
            {
                cacheEntry.SetOptions(CachingContext.MemoryCacheEntryOptionsWeek1);
                return await settingsRepository.GetAsync();
            });
        }

        public async Task<SettingsModel> UpdateApplicationAsync(SettingsApplication settingsApplication)
        {
            ResetCache();
            return await settingsRepository.UpdateApplicationAsync(settingsApplication);
        }

        public async Task<SettingsModel> UpdateEmploymentAsync(SettingsEmployment settingsEmployment)
        {
            ResetCache();
            return await settingsRepository.UpdateEmploymentAsync(settingsEmployment);
        }

        public async Task<SettingsModel> UpdateTasksAsync(SettingsTasks settingsTasks)
        {
            ResetCache();
            return await settingsRepository.UpdateTasksAsync(settingsTasks);
        }

        public async Task<SettingsModel> UpdateEmailAsync(SettingsEmail settingsEmail)
        {
            ResetCache();
            return await settingsRepository.UpdateEmailAsync(settingsEmail);
        }

        public async Task<SettingsModel> UpdateVacationRequestsAsync(SettingsVacationRequests settingsVacationRequests)
        {
            ResetCache();
            return await settingsRepository.UpdateVacationRequestsAsync(settingsVacationRequests);
        }

        public void ResetCache()
        {
            memoryCache.Remove(GetAsyncKey);
        }
    }
}
