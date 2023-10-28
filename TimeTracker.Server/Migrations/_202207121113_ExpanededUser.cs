using FluentMigrator;
using TimeTracker.Business.Enums;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207121113)]
    public class _202207121113_ExpanededUser : Migration
    {
        public override void Up()
        {
            Alter.Table("Users")
                .AddColumn("PermissionsString").AsString().NotNullable().WithDefaultValue("")
                .AddColumn("Employment").AsString().NotNullable().WithDefaultValue(Employment.FullTime)
                .AddColumn("AmountHoursPerMonth").AsInt32().NotNullable().WithDefaultValue(0)
                .AlterColumn("Role").AsInt32().NotNullable();

            Rename.Column("Role").OnTable("Users").To("RoleNumber");

            Delete.Column("RatePerHour").FromTable("Users");
        }

        public override void Down()
        {
        }
    }
}
