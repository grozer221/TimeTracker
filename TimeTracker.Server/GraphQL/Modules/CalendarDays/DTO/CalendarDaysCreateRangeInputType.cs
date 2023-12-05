using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.EnumTypes;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO
{
    public class CalendarDaysCreateRangeInput
    {
        public string? Title { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public IEnumerable<DayOfWeek> DaysOfWeek { get; set; }
        public DayKind Kind { get; set; }
        public int WorkHours { get; set; }
        public bool Override { get; set; }

        public async Task<IEnumerable<CalendarDayModel>> ToListAsync(CalendarDayRepository calendarDayRepository)
        {
            var list = new List<CalendarDayModel>();
            var fromCopy = From;
            while (DateTime.Compare(fromCopy, To) < 1)
            {
                if (DaysOfWeek.Contains(fromCopy.DayOfWeek))
                {

                    if (await calendarDayRepository.GetByDateAsync(fromCopy) != null)
                    {
                        if (Override)
                            await calendarDayRepository.RemoveAsync(fromCopy);
                        else
                            throw new Exception($"Calendar day for {fromCopy.ToString("yyyy-MM-dd")} already exists");
                    }
                    list.Add(new CalendarDayModel
                    {
                        Title = this.Title,
                        Date = fromCopy,
                        Kind = this.Kind,
                        WorkHours = this.WorkHours,
                    });
                }
                fromCopy = fromCopy.AddDays(1);
            }
            return list;
        }
    }

    public class CalendarDaysCreateRangeInputType : InputObjectGraphType<CalendarDaysCreateRangeInput>
    {
        public CalendarDaysCreateRangeInputType()
        {
            Field<StringGraphType, string?>()
                 .Name("Title")
                 .Resolve(context => context.Source.Title);

            Field<NonNullGraphType<DateGraphType>, DateTime>()
                 .Name("From")
                 .Resolve(context => context.Source.From);

            Field<NonNullGraphType<DateGraphType>, DateTime>()
                 .Name("To")
                 .Resolve(context => context.Source.To);

            Field<NonNullGraphType<ListGraphType<DayOfWeekType>>, IEnumerable<DayOfWeek>>()
                 .Name("DaysOfWeek")
                 .Resolve(context => context.Source.DaysOfWeek);

            Field<NonNullGraphType<DayKindType>, DayKind>()
                 .Name("Kind")
                 .Resolve(context => context.Source.Kind);

            Field<NonNullGraphType<IntGraphType>, int>()
                 .Name("WorkHours")
                 .Resolve(context => context.Source.WorkHours);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                 .Name("Override")
                 .Resolve(context => context.Source.Override);
        }
    }
}
