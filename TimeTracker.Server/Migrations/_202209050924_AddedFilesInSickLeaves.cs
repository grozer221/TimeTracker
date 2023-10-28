using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202209050924)]
    public class _202209050924_AddedFilesInSickLeaves : Migration
    {
        public override void Up()
        {
            Alter.Table("SickLeave")
                .AddColumn("Files").AsString(600).WithDefaultValue("[]");
        }

        public override void Down()
        {
        }
    }
}
