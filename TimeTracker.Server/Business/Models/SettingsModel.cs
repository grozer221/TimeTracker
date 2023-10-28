using Newtonsoft.Json;
using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Models.SettingsCategories;
using TimeTracker.Business.Models.SettingsCategories.SettingsTasksCategories;

namespace TimeTracker.Business.Models
{
    public class SettingsModel : BaseModel
    {
        public string EmploymentString { get; private set; }
        public SettingsEmployment Employment
        {
            get => JsonConvert.DeserializeObject<SettingsEmployment>(EmploymentString ?? string.Empty) ?? new SettingsEmployment();
            set => EmploymentString = JsonConvert.SerializeObject(value);
        }
        
        public string ApplicationString { get; private set; }
        public SettingsApplication Application
        {
            get => JsonConvert.DeserializeObject<SettingsApplication>(ApplicationString ?? string.Empty) ?? new SettingsApplication();
            set => ApplicationString = JsonConvert.SerializeObject(value);
        }
        
        public string TasksString { get; private set; }
        public SettingsTasks Tasks
        {
            get => JsonConvert.DeserializeObject<SettingsTasks>(TasksString ?? string.Empty) ?? new SettingsTasks();
            set => TasksString = JsonConvert.SerializeObject(value);
        }
        
        public string EmailString { get; private set; }
        public SettingsEmail Email
        {
            get => JsonConvert.DeserializeObject<SettingsEmail>(EmailString ?? string.Empty) ?? new SettingsEmail();
            set => EmailString = JsonConvert.SerializeObject(value);
        }
        
        public string VacationRequestsString { get; private set; }
        public SettingsVacationRequests VacationRequests
        {
            get => JsonConvert.DeserializeObject<SettingsVacationRequests>(VacationRequestsString ?? string.Empty) ?? new SettingsVacationRequests();
            set => VacationRequestsString = JsonConvert.SerializeObject(value);
        }
    }
}
