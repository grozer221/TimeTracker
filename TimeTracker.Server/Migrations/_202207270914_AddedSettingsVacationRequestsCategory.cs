using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207270914)]
    public class _202207270914_AddedSettingsVacationRequestsCategory : Migration
    {
        public override void Up()
        {
            Alter.Table("Settings")
               .AddColumn("VacationRequestsString").AsCustom("nvarchar(4000)").NotNullable().WithDefaultValue("{}");
        }

        public override void Down()
        {
        }
    }
}
