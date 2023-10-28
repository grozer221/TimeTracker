using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class ExcelModel
    {
        [DisplayName("Initials")]
        public string UserInitials { get; set; } = "";
        [DisplayName("Employment type")]
        public Employment Employment { get; set; }
        [DisplayName("Worker Hours")]
        public double WorkerHours { get; set; }
        [DisplayName("Month Hours")]
        public int MonthHours { get; set; } = 160;
        [DisplayName("Persent of Work")]
        public double PersentOfWork { get; set; } = 0;
        [DisplayName("Sick Leave Hours")]
        public double SickLeaveHours { get; set; }
        [DisplayName("Vacantion Hours")]
        public double VacantionHours { get; set; }
    }
}
