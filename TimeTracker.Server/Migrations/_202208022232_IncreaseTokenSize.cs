using FluentMigrator;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202208022232)]
    public class _202208022232_IncreaseTokenSize : Migration
    {
        public override void Up()
        {
            Execute.Sql("DROP INDEX [IX_Tokens_Token] ON [dbo].[AccessTokens]");
            Alter.Table("AccessTokens")
                .AlterColumn("Token").AsString(600).NotNullable();
            
        }

        public override void Down()
        {
        }
    }
}
