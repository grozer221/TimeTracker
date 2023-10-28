using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207231248)]
    public class _202207231248_AddedSettingsEmail : Migration
    {
        public override void Up()
        {
            Alter.Table("Settings")
                .AddColumn("EmailString").AsCustom("nvarchar(4000)").NotNullable().WithDefaultValue("{}");
        }

        public override void Down()
        {
        }
    }
}
