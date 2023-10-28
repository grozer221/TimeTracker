using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207011320)]
    public class _202207011320_Init : Migration
    {
        public override void Up()
        {
            Create.Table("Users")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("Email").AsString(100).NotNullable().Unique()
                .WithColumn("Password").AsString(255).NotNullable()
                .WithColumn("FirstName").AsString(100).NotNullable()
                .WithColumn("LastName").AsString(100).NotNullable()
                .WithColumn("MiddleName").AsString(100).NotNullable()
                .WithColumn("Role").AsString(100).NotNullable()
                .WithColumn("RatePerHour").AsDecimal().Nullable()
                .WithColumn("CreatedAt").AsDateTime()
                .WithColumn("UpdatedAt").AsDateTime();
        }

        public override void Down()
        {
            Delete.Table("Users");
        }
    }
}
