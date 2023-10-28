using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202209051127)]
    public class _202209051127_UpdatedSickLeavesFiles : Migration
    {
        public override void Up()
        {
            Rename.Column("Files").OnTable("SickLeave").To("FilesString");
        }

        public override void Down()
        {
        }
    }
}
