using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207301135)]
    public class _202207301135_RenamedVocationRequestsToVacationRequests : Migration
    {
        public override void Up()
        {
            Rename.Table("Users_UsersWhichCanApproveVocationRequests").To("Users_UsersWhichCanApproveVacationRequests");
            Rename.Column("UserWhichCanApproveVocationRequestId")
                .OnTable("Users_UsersWhichCanApproveVacationRequests")
                .To("UserWhichCanApproveVacationRequestId");
        }

        public override void Down()
        {
        }
    }
}
