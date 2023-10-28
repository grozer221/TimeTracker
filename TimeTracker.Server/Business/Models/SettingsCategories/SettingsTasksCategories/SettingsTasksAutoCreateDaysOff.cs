using TimeTracker.Business.Extensions;

namespace TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories
{
    public class SettingsTasksAutoCreateDaysOff
    {
        public bool IsEnabled { get; set; }
        public DayOfWeek DayOfWeekWhenCreate { get; set; }
        public DateTime timeWhenCreate;
        public DateTime TimeWhenCreate
        {
            get => timeWhenCreate.AsUtc();
            set => timeWhenCreate = value;
        }
        public List<DayOfWeek> DaysOfWeek { get; set; } = new List<DayOfWeek>();
    }
}
