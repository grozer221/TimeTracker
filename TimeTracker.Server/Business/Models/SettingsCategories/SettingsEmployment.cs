using TimeTracker.Business.Extensions;

namespace TimeTracker.Business.Models.SettingsCategories
{
    public class SettingsEmployment
    {
        public DateTime workdayStartAt;
        public DateTime WorkdayStartAt
        {
            get => workdayStartAt.AsUtc();
            set => workdayStartAt = value;
        }
        public int HoursInWorkday { get; set; }
    }
}
