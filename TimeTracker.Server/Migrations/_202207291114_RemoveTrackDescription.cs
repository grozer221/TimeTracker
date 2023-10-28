using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207291114)]
    public class _202207291114_RemoveTrackDescription : Migration
    {
        public override void Up()
        {
            Delete.Column("Description")
                .FromTable("Tracks");
        }

        public override void Down()
        {
        }
    }
}
