using TimeTracker.Business.Abstractions;

namespace TimeTracker.Business.Models
{
    public class CompanyModel : BaseModel
    {
        public string Name { get; set; }

        public string Email { get; set; }
    }
}
