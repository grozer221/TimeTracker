﻿using System.Security.Claims;

namespace TimeTracker.Server.GraphQL.Modules.Auth
{
    public class AuthClaimsIdentity : ClaimsIdentity
    {
        public const string DefaultIdClaimType = "Id";
        public const string DefaultEmailClaimType = "Email";
    }
}
