﻿using TimeTracker.Business.Models;

namespace TimeTracker.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthResponse
    {
        public UserModel User { get; set; }
        public string Token { get; set; }
    }
}
