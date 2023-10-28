using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207041723)]
    public class _202207041723_UpdatedTokens : Migration
    {
        public override void Up()
        {
            Alter.Table("Tokens")
                .AlterColumn("Token").AsString(500).NotNullable();
        }

        public override void Down()
        {
        }
    }
}
