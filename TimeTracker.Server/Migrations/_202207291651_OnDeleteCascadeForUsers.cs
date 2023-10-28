using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207291651)]
    public class _202207291651_OnDeleteCascadeForUsers : Migration
    {
        public override void Up()
        {
            Delete.ForeignKey("FK_Users_UsersWhichCanApproveVocationRequests_UserWhichCanApproveVocationRequestId_Users_Id").OnTable("Users_UsersWhichCanApproveVocationRequests");
            Alter.Table("Users_UsersWhichCanApproveVocationRequests")
                .AlterColumn("UserWhichCanApproveVocationRequestId").AsGuid().NotNullable().ForeignKey("Users", "Id").OnDeleteOrUpdate(Rule.Cascade);
        }

        public override void Down()
        {
        }
    }
}
