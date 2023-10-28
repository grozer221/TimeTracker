namespace TimeTracker.Business.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime AsUtc(this DateTime dateTime)
        {
            return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }
    }
}
