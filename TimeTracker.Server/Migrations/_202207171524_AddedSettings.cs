using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207171524)]
    public class _202207171524_AddedSettings : Migration
    {
        public override void Up()
        {
            Create.Table("Settings")
                 .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                 .WithColumn("CommonString").AsString().NotNullable().WithDefaultValue("{}")
                 .WithColumn("CreatedAt").AsDateTime()
                 .WithColumn("UpdatedAt").AsDateTime();
        }

        public override void Down()
        {
        }
    }
}
