using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207231948)]
    public class _202207231948_UpdatedTablesNamesWithTokens : Migration
    {
        public override void Up()
        {
            Rename.Table("ResetTokens").To("ResetPassTokens");
            Rename.Table("Tokens").To("AccessTokens");
        }

        public override void Down()
        {
        }
    }
}
