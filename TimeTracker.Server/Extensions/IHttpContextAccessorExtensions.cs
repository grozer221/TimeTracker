using TimeTracker.Business.Enums;

namespace TimeTracker.Server.Extensions
{
    public static class IHttpContextAccessorExtensions
    {
        public static Guid GetUserId(this HttpContext httpContext)
        {
            return httpContext.User.Claims.GetUserId();
        }

        public static string GetUserEmail(this HttpContext httpContext)
        {
            return httpContext.User.Claims.GetUserEmail();
        }

        public static Guid GetCompanyId(this HttpContext httpContext)
            => httpContext.User.Claims.GetCompanyId();

        public static Role GetRole(this HttpContext httpContext)
        {
            return httpContext.User.Claims.GetRole();
        }

        public static IEnumerable<Permission> GetPermissions(this HttpContext httpContext)
        {
            return httpContext.User.Claims.GetPermissions();
        }

        public static bool IsHavePermissions(this HttpContext httpContext, params Permission[] requestPermissions)
        {
            return httpContext.User.Claims.IsHavePermissions(requestPermissions);
        }

        public static bool IsAdministrator(this HttpContext httpContext)
        {
            return httpContext.User.Claims.IsAdministrator();
        }

        public static bool IsAdministratorOrHavePermissions(this HttpContext httpContext, params Permission[] requestPermissions)
        {
            return httpContext.User.Claims.IsAdministratOrHavePermissions(requestPermissions);
        }
    }
}
