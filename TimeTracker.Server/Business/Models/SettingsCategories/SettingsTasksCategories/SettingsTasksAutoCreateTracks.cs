using TimeTracker.Business.Extensions;

namespace TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories
{
    public class SettingsTasksAutoCreateTracks
    {
        public bool IsEnabled { get; set; }
        public DateTime timeWhenCreate;
        public DateTime TimeWhenCreate 
        { 
            get => timeWhenCreate.AsUtc();
            set => timeWhenCreate = value; 
        }
    }
}
