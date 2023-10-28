using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208030722)]
    public class _202208030722_AddedCompletedTasks : Migration
    {
        public override void Up()
        {
            Create.Table("CompletedTasks")
               .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
               .WithColumn("DateExecute").AsDateTime().NotNullable()
               .WithColumn("Name").AsString(200).NotNullable()
               .WithColumn("CreatedAt").AsDateTime().NotNullable()
               .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        public override void Down()
        {
        }
    }
}
