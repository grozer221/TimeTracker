using TimeTracker.Business.Enums;

namespace TimeTracker.Server.GraphQL.Modules.Auth;

public class AuthPolicies
{
    public static readonly string Authenticated = "Authenticated";

    public static readonly string Employee = Role.Employee.ToString();

    public static readonly string Admin = Role.Admin.ToString();

    public static readonly string SuperAdmin = Role.SuperAdmin.ToString();
}
