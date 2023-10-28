using TimeTracker.Business.Abstractions;

namespace TimeTracker.Business.Models
{
    public class AceessTokenModel : BaseModel
    {
        public string Token { get; set; }
        public Guid UserId { get; set; }
    }
}
