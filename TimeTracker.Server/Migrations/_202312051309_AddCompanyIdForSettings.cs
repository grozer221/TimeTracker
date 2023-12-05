using FluentMigrator;

using System.Data;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202312051309)]
    public class _202312051309_AddCompanyIdForSettings : Migration
    {
        public override void Up()
        {
            Alter.Table("Settings")
                .AddColumn("CompanyId")
                .AsGuid()
                .NotNullable()
                .ForeignKey("Companies", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }

        public override void Down()
        {
        }
    }
}
