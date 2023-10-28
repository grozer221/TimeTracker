using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207291453)]
    public class _202207291453_AddTrackType : Migration
    {
        public override void Up()
        {
            Alter.Table("Tracks")
                .AddColumn("Kind").AsInt32().NotNullable().WithDefaultValue(0);
        }

        public override void Down()
        {
        }
    }
}
