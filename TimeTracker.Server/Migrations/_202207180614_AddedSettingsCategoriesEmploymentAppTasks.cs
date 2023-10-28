using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207180614)]
    public class _202207180614_AddedSettingsCategoriesEmploymentAppTasks : Migration
    {
        public override void Up()
        {
            Rename.Column("CommonString")
                .OnTable("Settings")
                .To("EmploymentString");

            Alter.Table("Settings")
                .AddColumn("ApplicationString").AsString().NotNullable().WithDefaultValue("{}")
                .AddColumn("TasksString").AsString().NotNullable().WithDefaultValue("{}");
                
        }

        public override void Down()
        {
        }
    }
}
