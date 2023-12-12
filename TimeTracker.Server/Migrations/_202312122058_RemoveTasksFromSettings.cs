using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202312122058)]
    public class _202312122058_RemoveTasksFromSettings : Migration
    {
        public override void Up()
        {
            Delete.Column("TasksString")
                .FromTable("Settings");
        }

        public override void Down()
        {
        }
    }
}
