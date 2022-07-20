﻿using FluentValidation;
using GraphQL;
using GraphQL.Server;
using GraphQL.SystemTextJson;
using Quartz;
using System.Reflection;
using System.Security.Claims;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Managers;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.GraphQL;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.Middlewares;
using TimeTracker.Server.Services;
using TimeTracker.Server.Tasks;

namespace TimeTracker.Server.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddGraphQLApi(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly(), ServiceLifetime.Transient);
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IDocumentExecuter, DocumentExecuter>();

            services.AddTransient<AppSchema>();
            services.AddGraphQLUpload();
            services
                .AddGraphQL(options =>
                {
                    options.EnableMetrics = true;
                    options.UnhandledExceptionDelegate = (context) =>
                    {
                        Console.WriteLine(context.Exception.StackTrace);
                        context.ErrorMessage = context.Exception.Message;
                    };
                })
                .AddSystemTextJson()
                .AddGraphTypes(typeof(AppSchema), ServiceLifetime.Transient)
                .AddGraphQLAuthorization(options =>
                {
                    options.AddPolicy(AuthPolicies.Authenticated, p => p.RequireAuthenticatedUser());
                    options.AddPolicy(AuthPolicies.Employee, p => p.RequireClaim(ClaimTypes.Role, Role.Employee.ToString(), Role.Administrator.ToString()));
                    options.AddPolicy(AuthPolicies.Administrator, p => p.RequireClaim(ClaimTypes.Role, Role.Administrator.ToString()));
                });

            return services;
        }

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services)
        {
            services
                .AddAuthentication(BasicAuthenticationHandler.SchemeName)
                .AddScheme<BasicAuthenticationOptions, BasicAuthenticationHandler>(BasicAuthenticationHandler.SchemeName, options => { });
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddSingleton<IAuthService, AuthService>();
            services.AddSingleton<IFileUploadService, FileUploadService>();
            return services;
        }

        public static IServiceCollection AddTasks(this IServiceCollection services)
        {
            services.AddHostedService<TasksService>();
            services.AddScoped<DemoTask>();
            services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionScopedJobFactory();
                q.AddJob<DemoTask>(configure => configure.WithIdentity(DemoTask.JobKey));
                var demoTask = services.BuildServiceProvider().GetRequiredService<DemoTask>();
                q.AddTrigger(configure => demoTask.ConfigureTriggerConfiguratorAsync(configure).GetAwaiter().GetResult());
            });
            return services;
        }
    }
}
