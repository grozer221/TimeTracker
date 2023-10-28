using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207141501)]
    public class _202207141501_AddedCalendarDays : Migration
    {
        public override void Up()
        {
            Create.Table("CalendarDays")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("Date").AsDate().NotNullable().Unique()
                .WithColumn("Kind").AsInt32().NotNullable()
                .WithColumn("PercentageWorkHours").AsInt32().NotNullable()
                .WithColumn("CreatedAt").AsDateTime()
                .WithColumn("UpdatedAt").AsDateTime();
        }

        public override void Down()
        {
        }
    }
}
