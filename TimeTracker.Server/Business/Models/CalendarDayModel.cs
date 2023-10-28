using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class CalendarDayModel : BaseModel
    {
        public string? Title { get; set; }
        public DateTime Date { get; set; }
        public DayKind Kind { get; set; }
        public int WorkHours { get; set; }
    }
}
