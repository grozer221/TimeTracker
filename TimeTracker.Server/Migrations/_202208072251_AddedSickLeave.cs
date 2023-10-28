using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208072251)]
    public class _202208072251_AddedSickLeave : Migration
    {
        public override void Up()
        {
            Create.Table("SickLeave")
               .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
               .WithColumn("StartDate").AsDate().NotNullable()
               .WithColumn("EndDate").AsDate().NotNullable()
               .WithColumn("Comment").AsString().Nullable()
               .WithColumn("UserId").AsGuid().NotNullable().ForeignKey("Users", "Id")
               .WithColumn("CreatedAt").AsDateTime().NotNullable()
               .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        public override void Down()
        {
        }
    }
}
