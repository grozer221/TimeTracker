using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207151500)]
    public class _202207151500_AddedTitleForCalendarDays : Migration
    {
        public override void Up()
        {
            Alter.Table("CalendarDays")
                .AddColumn("Title").AsString().Nullable();
        }

        public override void Down()
        {
        }
    }
}
