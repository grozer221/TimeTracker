using Microsoft.Extensions.Caching.Memory;

using TimeTracker.Business.Abstraction;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.DataAccess.Managers
{
    public class CalendarDayManager : IManager
    {
        public const string GetByDateAsyncRangeKey = "GetByDateAsyncRangeKey";
        public const string GetByDateAsyncKey = "GetByDateAsyncKey/{0}";
        public const string GetAsyncKey = "GetAsyncKey";
        public const string GetFromToAsyncKey = "GetFromToAsyncKey/{0}/{1}";
        public const string GetFromToAsyncRangesKey = "GetFromToAsyncRangesKey";
        private readonly IMemoryCache memoryCache;
        private readonly CalendarDayRepository calendarDayRepository;

        public CalendarDayManager(IMemoryCache memoryCache, CalendarDayRepository calendarDayRepository)
        {
            this.memoryCache = memoryCache;
            this.calendarDayRepository = calendarDayRepository;
        }

        public async Task<CalendarDayModel> GetByDateAsync(DateTime date1)
        {
            var date = new DateTime(date1.Year, date1.Month, date1.Day);
            string key = string.Format(GetByDateAsyncKey, date);
            string getByDateAsyncRangeKey = GetByDateAsyncRangeKey;
            var dates = memoryCache.GetOrCreate(getByDateAsyncRangeKey, cacheEntry => new List<DateTime>());
            if (!dates.Any(d => d == date))
            {
                dates.Add(date);
                memoryCache.Set(getByDateAsyncRangeKey, dates);
            }
            return await memoryCache.GetOrCreateAsync(key, async cacheEntry =>
            {
                cacheEntry.SetOptions(CachingContext.MemoryCacheEntryOptionsWeek1);
                return await calendarDayRepository.GetByDateAsync(date);
            });
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync()
        {
            string key = GetAsyncKey;
            return await memoryCache.GetOrCreateAsync(key, async cacheEntry =>
            {
                return await calendarDayRepository.GetAsync();
            });
        }

        public async Task<IEnumerable<CalendarDayModel>> GetAsync(DateTime from, DateTime to)
        {
            string key = string.Format(GetFromToAsyncKey, from, to);
            string getFromToAsyncRangesKey = GetFromToAsyncRangesKey;
            var fromTos = memoryCache.GetOrCreate(getFromToAsyncRangesKey, cacheEntry => new List<FromTo>());
            if (!fromTos.Any(fromTo => fromTo.From == from && fromTo.To == to))
            {
                fromTos.Add(new FromTo { From = from, To = to });
                memoryCache.Set(getFromToAsyncRangesKey, fromTos);
            }
            return await memoryCache.GetOrCreateAsync(key, async cacheEntry =>
            {
                return await calendarDayRepository.GetAsync(from, to);
            });
        }

        public async Task<CalendarDayModel> CreateAsync(CalendarDayModel model)
        {
            ResetCache();
            return await calendarDayRepository.CreateAsync(model);
        }

        public async Task<CalendarDayModel> UpdateAsync(CalendarDayModel model)
        {
            ResetCache();
            return await calendarDayRepository.UpdateAsync(model);
        }

        public async Task<CalendarDayModel> RemoveAsync(DateTime date)
        {
            ResetCache();
            return await calendarDayRepository.RemoveAsync(date);
        }

        public void ResetCache()
        {
            var getByDateAsyncRangeKey = GetByDateAsyncRangeKey;
            var dates = memoryCache.GetOrCreate(getByDateAsyncRangeKey, cacheEntry => new List<DateTime>());
            foreach (var date in dates)
                memoryCache.Remove(string.Format(GetByDateAsyncKey, date));
            memoryCache.Remove(getByDateAsyncRangeKey);

            var getFromToAsyncRangesKey = GetFromToAsyncRangesKey;
            var fromTos = memoryCache.GetOrCreate(getFromToAsyncRangesKey, cacheEntry => new List<FromTo>());
            foreach (var fromto in fromTos)
                memoryCache.Remove(string.Format(GetFromToAsyncKey, fromto.From, fromto.To));
            memoryCache.Remove(getFromToAsyncRangesKey);

            memoryCache.Remove(GetAsyncKey);
        }

        public class FromTo
        {
            public DateTime From { get; set; }
            public DateTime To { get; set; }
        }
    }
}
