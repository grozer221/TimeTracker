using Newtonsoft.Json;
using TimeTracker.Business.Abstractions;

namespace TimeTracker.Business.Models
{
    public class SickLeaveModel : BaseModel
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid UserId { get; set; }
        public string Comment { get; set; } = "";
        public string FilesString { get; private set; }
        public IEnumerable<string> Files 
        { 
            get => JsonConvert.DeserializeObject<IEnumerable<string>>(FilesString ?? "[]"); 
            set => FilesString = JsonConvert.SerializeObject(value); 
        }
    }
}
