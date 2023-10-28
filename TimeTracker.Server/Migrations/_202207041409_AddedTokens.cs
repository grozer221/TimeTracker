using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207041409)]
    public class _202207041409_AddedTokens : Migration
    {
        public override void Up()
        {
            Create.Table("Tokens")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("Token").AsString(100).NotNullable().Unique()
                .WithColumn("UserId").AsGuid().NotNullable().ForeignKey("Users", "Id").OnDeleteOrUpdate(System.Data.Rule.Cascade)
                .WithColumn("CreatedAt").AsDateTime().NotNullable()
                .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        public override void Down()
        {
            Delete.Table("Users");
        }
    }
}
