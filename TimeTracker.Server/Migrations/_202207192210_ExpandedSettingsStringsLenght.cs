using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207192210)]
    public class _202207192210_ExpandedSettingsStringsLenght : Migration
    {
        public override void Up()
        {
            Alter.Table("Settings")
                .AlterColumn("EmploymentString").AsCustom("nvarchar(4000)").NotNullable().WithDefaultValue("{}")
                .AlterColumn("ApplicationString").AsCustom("nvarchar(4000)").NotNullable().WithDefaultValue("{}")
                .AlterColumn("TasksString").AsCustom("nvarchar(4000)").NotNullable().WithDefaultValue("{}");
        }

        public override void Down()
        {
        }
    }
}
