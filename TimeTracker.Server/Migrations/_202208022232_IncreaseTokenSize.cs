using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208022232)]
    public class _202208022232_IncreaseTokenSize : Migration
    {
        public override void Up()
        {
            Execute.Sql("DROP INDEX [IX_Tokens_Token] ON [dbo].[AccessTokens]");
            Alter.Table("AccessTokens")
                .AlterColumn("Token").AsString(600).NotNullable();

        }

        public override void Down()
        {
        }
    }
}
