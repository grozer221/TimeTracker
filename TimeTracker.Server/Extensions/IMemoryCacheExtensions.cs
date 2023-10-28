using Microsoft.Extensions.Caching.Memory;

namespace TimeTracker.Server.Extensions
{
    public static class IMemoryCacheExtensions
    {
        public static async Task<T> GetAsync<T>(this IMemoryCache memoryCache, string key, Func<Task<T>> func, MemoryCacheEntryOptions options = null)
        {
            options ??= new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(24));
            T model;
            if (!memoryCache.TryGetValue(key, out model))
            {
                model = await func();
                memoryCache.Set(key, model, options);
            }
            return model;
        }
    }
}
