using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class CompletedTaskModel : BaseModel
    {
        public DateTime DateExecute { get; set; }
        public string Name { get; set; }
    }
}
