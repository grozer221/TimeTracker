using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207191023)]
    public class _202207191023_AddedSalt : Migration
    {
        public override void Up()
        {

            Delete.Column("AmountHoursPerMonth")
                .FromTable("Users");

            Alter.Table("Users")
                .AddColumn("Salt").AsString(255).NotNullable().WithDefaultValue("");
                
        }

        public override void Down()
        {
        }
    }
}
