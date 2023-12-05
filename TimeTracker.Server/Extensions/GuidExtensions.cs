namespace TimeTracker.Server.Extensions
{
    public static class GuidExtensions
    {
        public static Guid GetOrDefault(this Guid guid, Guid defaultGuid)
            => guid == Guid.Empty ? defaultGuid : guid;

        public static Guid GetOrDefault(this Guid? guid, Guid defaultGuid)
            => guid == null ? defaultGuid : guid.Value.GetOrDefault(defaultGuid);
    }
}
