using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207281429)]
    public class _202207281429_UpdatedPersentageToHoursInCalendarDays : Migration
    {
        public override void Up()
        {
            Rename.Column("PercentageWorkHours").OnTable("CalendarDays").To("WorkHours");
        }

        public override void Down()
        {
        }
    }
}
