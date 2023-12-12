using FluentMigrator;

using System.Data;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202312121311)]
    public class _202312121311_AddActiveSubscriptionsTable : Migration
    {
        public override void Up()
        {
            Create.Table("ActiveSubscriptions")
               .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
               .WithColumn("TypeNumber").AsInt32().NotNullable()
               .WithColumn("CompanyId").AsGuid().NotNullable().ForeignKey("Companies", "Id").OnDeleteOrUpdate(Rule.Cascade)
               .WithColumn("DateExpire").AsDateTime().NotNullable()
               .WithColumn("CreatedAt").AsDateTime().NotNullable()
               .WithColumn("UpdatedAt").AsDateTime().NotNullable();

        }

        public override void Down()
        {
        }
    }
}
