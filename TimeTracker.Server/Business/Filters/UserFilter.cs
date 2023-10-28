using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models.Filters
{
    public class UserFilter
    {
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
        public IEnumerable<Permission>? Permissions { get; set; }
        public IEnumerable<Employment>? Employments { get; set; }
        public IEnumerable<Role>? Roles { get; set; }

    }
}
