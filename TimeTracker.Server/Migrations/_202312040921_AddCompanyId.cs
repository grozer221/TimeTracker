using FluentMigrator;

using System.Data;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202312040921)]
    public class _202312040921_AddCompanyId : Migration
    {
        public override void Up()
        {
            Alter.Table("CalendarDays")
                .AddColumn("CompanyId")
                .AsGuid()
                .NotNullable()
                .ForeignKey("Companies", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);

            Alter.Table("Users")
                .AddColumn("CompanyId")
                .AsGuid()
                .Nullable()
                .ForeignKey("Companies", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }

        public override void Down()
        {
        }
    }
}
