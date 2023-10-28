using TimeTracker.Business.Abstractions;

namespace TimeTracker.Business.Models
{
    public class Users_UsersWhichCanApproveVacationRequests : BaseModel
    {
        public Guid UserId { get; set; }
        public Guid UserWhichCanApproveVacationRequestId { get; set; }
    }
}
