using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208291556)]
    public class _202208291556_AddedTrackCreationType : Migration
    {
        public override void Up()
        {
            Alter.Table("Tracks")
                .AddColumn("Creation").AsInt32().NotNullable().WithDefaultValue(0);
        }

        public override void Down()
        {
        }
    }
}
