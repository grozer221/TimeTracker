using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208292337)]
    public class _202208292337_AddedTrackEditedBy : Migration
    {
        public override void Up()
        {
            Alter.Table("Tracks")
                .AddColumn("EditedBy").AsString(600).Nullable();
        }

        public override void Down()
        {
        }
    }
}
