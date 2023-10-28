using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Business.Abstractions;

namespace TimeTracker.Business.Models
{
    public class StatisticModel : BaseModel
    {
        public double WorkerHours { get; set; }
        public int MonthHours { get; set; } = 160;
    }
}
