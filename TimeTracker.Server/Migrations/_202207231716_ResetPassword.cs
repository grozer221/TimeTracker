using FluentMigrator;
using System.Data;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207231716)]
    public class _202207231716_ResetPassword : Migration
    {
        public override void Up()
        {
            Create.Table("ResetTokens")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("Token").AsString(300).NotNullable().Unique()
                .WithColumn("UserId").AsGuid().NotNullable().ForeignKey("Users", "Id").OnDeleteOrUpdate(Rule.Cascade)
                .WithColumn("CreatedAt").AsDateTime().NotNullable()
                .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        public override void Down()
        {
            Delete.Table("ResetTokens");
        }
    }
}
