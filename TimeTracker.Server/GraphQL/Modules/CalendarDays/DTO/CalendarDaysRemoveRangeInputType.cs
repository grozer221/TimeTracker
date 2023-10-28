using GraphQL.Types;

using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.GraphQL.EnumTypes;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysRemoveRangeInput
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public IEnumerable<DayOfWeek> DaysOfWeek { get; set; }

        public async Task<IEnumerable<DateTime>> ToDatesListAsync(CalendarDayManager calendarDayManager)
        {
            var list = new List<DateTime>();
            var fromCopy = From;
            while (DateTime.Compare(fromCopy, To) < 1)
            {
                if (DaysOfWeek.Contains(fromCopy.DayOfWeek))
                {
                    if (await calendarDayManager.GetByDateAsync(fromCopy) != null)
                    {
                        list.Add(fromCopy);
                    }
                }
                fromCopy = fromCopy.AddDays(1);
            }
            return list;
        }
    }

    public class CalendarDaysRemoveRangeInputType : InputObjectGraphType<CalendarDaysRemoveRangeInput>
    {
        public CalendarDaysRemoveRangeInputType()
        {
            Field<NonNullGraphType<DateGraphType>, DateTime>()
                 .Name("From")
                 .Resolve(context => context.Source.From);

            Field<NonNullGraphType<DateGraphType>, DateTime>()
                 .Name("To")
                 .Resolve(context => context.Source.To);

            Field<NonNullGraphType<ListGraphType<DayOfWeekType>>, IEnumerable<DayOfWeek>>()
                 .Name("DaysOfWeek")
                 .Resolve(context => context.Source.DaysOfWeek);
        }
    }
}
