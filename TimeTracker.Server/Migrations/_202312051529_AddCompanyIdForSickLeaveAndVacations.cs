using FluentMigrator;

using System.Data;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202312051529)]
    public class _202312051529_AddCompanyIdForSickLeaveAndVacations : Migration
    {
        public override void Up()
        {
            Alter.Table("SickLeave")
                .AddColumn("CompanyId")
                .AsGuid()
                .NotNullable()
                .ForeignKey("Companies", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);

            Alter.Table("VacationRequests")
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
