using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202310281133)]
    public class _202310281133_AddCompaniesTable : Migration
    {
        public override void Up()
        {
            Create.Table("Companies")
                .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
                .WithColumn("Name").AsString().NotNullable()
                .WithColumn("Email").AsString().NotNullable()
                .WithColumn("CreatedAt").AsDateTime()
                .WithColumn("UpdatedAt").AsDateTime();
        }

        public override void Down()
        {
        }
    }
}
