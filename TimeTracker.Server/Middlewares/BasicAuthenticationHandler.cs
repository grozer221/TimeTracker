using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;

using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Encodings.Web;

using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;

namespace TimeTracker.Server.Middlewares
{
    public class BasicAuthenticationOptions : AuthenticationSchemeOptions
    {
    }

    public class BasicAuthenticationHandler : AuthenticationHandler<BasicAuthenticationOptions>
    {
        public const string SchemeName = "TimeTrackerSchemeName";
        private readonly AccessTokenRepository tokenRepository;

        public BasicAuthenticationHandler(
            IOptionsMonitor<BasicAuthenticationOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            AccessTokenRepository tokenRepository) : base(options, logger, encoder, clock)
        {
            this.tokenRepository = tokenRepository;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            string token = Request.Headers[HeaderNames.Authorization];
            var handler = new JwtSecurityTokenHandler();
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey"))),
                ValidateIssuer = false,
                ValidateAudience = false
            };
            try
            {
                var claimsPrincipal = handler.ValidateToken(token, validations, out var tokenSecure);
                var userId = claimsPrincipal.Claims.GetUserId();
                var tokens = await tokenRepository.GetByUserId(userId);
                if (!tokens.Any(t => t.Token == token))
                    throw new Exception("Bad token");
                var ticket = new AuthenticationTicket(claimsPrincipal, new AuthenticationProperties { IsPersistent = false }, SchemeName);
                return AuthenticateResult.Success(ticket);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return AuthenticateResult.Fail(ex);
            }
        }
    }
}
