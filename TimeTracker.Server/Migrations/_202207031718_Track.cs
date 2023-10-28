using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207031718)]
    public class _202207031718_Track : Migration
    {
        public override void Up()
        {
            Create.Table("Tracks")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("UserId").AsGuid().NotNullable()
                .WithColumn("Title").AsString(50).NotNullable()
                .WithColumn("Description").AsString(200).Nullable()
                .WithColumn("StartTime").AsDateTime().Nullable()
                .WithColumn("EndTime").AsDateTime().Nullable()
                .WithColumn("CreatedAt").AsDateTime()
                .WithColumn("UpdatedAt").AsDateTime();
        }

        public override void Down()
        {
            Delete.Table("Tracks");
        }
    }
}
