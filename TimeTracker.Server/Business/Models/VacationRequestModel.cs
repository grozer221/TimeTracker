using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class VacationRequestModel : BaseModel
    {
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public string? Comment { get; set; }
        public VacationRequestStatus Status { get; set; }
        public Guid UserId { get; set; }
        public UserModel User { get; set; }
    }
}
