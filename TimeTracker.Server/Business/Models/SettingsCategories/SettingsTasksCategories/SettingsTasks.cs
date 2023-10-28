namespace TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories
{
    public class SettingsTasks
    {
        public SettingsTasksAutoCreateTracks AutoCreateTracks { get; set; } = new SettingsTasksAutoCreateTracks();
        public SettingsTasksAutoCreateDaysOff AutoCreateDaysOff { get; set; } = new SettingsTasksAutoCreateDaysOff();
    }
}
