using Newtonsoft.Json;

using System.Security.Claims;

using TimeTracker.Business.Enums;
using TimeTracker.Server.GraphQL.Modules.Auth;

namespace TimeTracker.Server.Extensions;

public static class ClaimExtensions
{
    public static Guid GetUserId(this IEnumerable<Claim> claims)
    {
        return new Guid(claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
    }

    public static string GetUserEmail(this IEnumerable<Claim> claims)
    {
        return claims.First(c => c.Type == AuthClaimsIdentity.DefaultEmailClaimType).Value;
    }

    public static Guid GetCompanyId(this IEnumerable<Claim> claims)
    {
        var companyId = claims.First(c => c.Type == AuthClaimsIdentity.DefaultCompanyIdClaimType).Value;
        return string.IsNullOrEmpty(companyId) ? Guid.Empty : new(companyId);
    }

    public static Role GetRole(this IEnumerable<Claim> claims)
    {
        Role role;
        if (!Enum.TryParse(claims.First(c => c.Type == AuthClaimsIdentity.DefaultRoleClaimType).Value, out role))
        {
            throw new Exception("Bad role");
        }
        return role;
    }

    public static IEnumerable<Permission> GetPermissions(this IEnumerable<Claim> claims)
    {
        return JsonConvert.DeserializeObject<IEnumerable<Permission>>(claims.First(c => c.Type == AuthClaimsIdentity.DefaultPermissionsClaimType).Value);
    }

    public static bool IsHavePermissions(this IEnumerable<Claim> claims, params Permission[] requestPermissions)
    {
        var permissions = claims.GetPermissions();
        return permissions.Intersect(requestPermissions).Count() > 0;
    }

    public static bool IsAdministrator(this IEnumerable<Claim> claims)
    {
        var role = claims.GetRole();
        return role == Role.Admin || IsSuperAdmin(claims);
    }

    public static bool IsSuperAdmin(this IEnumerable<Claim> claims)
    {
        var role = claims.GetRole();
        return role == Role.SuperAdmin;
    }

    public static bool IsAdministratOrHavePermissions(this IEnumerable<Claim> claims, params Permission[] requestPermissions)
    {
        var isHavePermissions = claims.IsHavePermissions(requestPermissions);
        return claims.IsAdministrator() || isHavePermissions;
    }
}
