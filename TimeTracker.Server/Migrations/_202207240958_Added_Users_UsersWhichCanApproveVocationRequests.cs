using FluentMigrator;

namespace TimeTracker.MsSql.Migrations
{
    [Migration(202207240958)]
    public class _202207240958_Added_Users_UsersWhichCanApproveVocationRequests : Migration
    {
        public override void Up()
        {
            Create.Table("Users_UsersWhichCanApproveVocationRequests")
               .WithColumn("Id").AsGuid().NotNullable().PrimaryKey()
               .WithColumn("UserId").AsGuid().NotNullable().ForeignKey("Users", "Id")
               .WithColumn("UserWhichCanApproveVocationRequestId").AsGuid().NotNullable().ForeignKey("Users", "Id")
               .WithColumn("CreatedAt").AsDateTime().NotNullable()
               .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        public override void Down()
        {
        }
    }
}
