using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207042009)]
    public class _202207042009_TrackUpdate : Migration
    {
        public override void Down()
        {
            
        }

        public override void Up()
        {
            Alter.Table("Tracks")
                .AlterColumn("UserId").AsGuid().NotNullable().ForeignKey("Users", "Id");
        }
    }
}
