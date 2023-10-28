using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Filters
{
    public class VacationRequestsFilter
    {
        public VacationRequestsFilterKind Kind { get; set; }
        public IEnumerable<VacationRequestStatus> Statuses { get; set; }
        public IEnumerable<Guid> UserIds { get; set; }
    }

    public enum VacationRequestsFilterKind
    {
        Mine,
        CanApprove,
        All,
    }
}
