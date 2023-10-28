using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class TrackModel : BaseModel
    {
        public Guid UserId { get; set; }
        public string? Title { get; set; }
        public TrackKind Kind { get; set; }
        public TrackCreation Creation { get; set; }
        public string? EditedBy { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

    }
}
