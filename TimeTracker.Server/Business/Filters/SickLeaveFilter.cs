using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Business.Filters
{
    public class SickLeaveFilter
    {
        public SickLeaveFilterKind Kind { get; set; }
    }

    public enum SickLeaveFilterKind
    {
        Mine,
        All,
    }
}
