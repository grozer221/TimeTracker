using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Abstractions
{
    public class GetEntitiesResponse<T> where T : BaseModel
    {
        public IEnumerable<T> Entities { get; set; }
        public int Total { get; set; }
        public int PageSize { get; set; }
        public TrackKind? TrackKind { get; set; }
    }
}
