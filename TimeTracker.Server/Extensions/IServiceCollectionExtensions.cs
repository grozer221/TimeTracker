using FluentMigrator.Runner;

using FluentValidation;

using GraphQL;
using GraphQL.Server;
using GraphQL.SystemTextJson;

using Microsoft.Extensions.DependencyInjection.Extensions;

using Quartz;

using System.Reflection;
using System.Security.Claims;

using TimeTracker.Business.Enums;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.DataAccess.Services;
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
                    options.AddPolicy(AuthPolicies.Employee, p => p.RequireClaim(
                        ClaimTypes.Role,
                        Role.Employee.ToString(),
                        Role.Admin.ToString(),
                        Role.SuperAdmin.ToString()));
                    options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, Role.Admin.ToString(), Role.SuperAdmin.ToString()));
                    options.AddPolicy(AuthPolicies.SuperAdmin, p => p.RequireClaim(ClaimTypes.Role, Role.SuperAdmin.ToString()));
                });

            return services;
        }

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services)
        {
            services
                .AddAuthentication(BasicAuthenticationHandler.SchemeName)
                .AddScheme<BasicAuthenticationOptions, BasicAuthenticationHandler>(BasicAuthenticationHandler.SchemeName, _ => { });
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddSingleton<IAuthService, AuthService>();
            services.AddSingleton<FileManagerService>();
            services.AddSingleton<INotificationService, EmailNotificationService>();
            services.AddScoped<VacationRequestsService>();
            services.AddScoped<CalendarDaysService>();
            return services;
        }

        public static IServiceCollection AddTasks(this IServiceCollection services)
        {
            services.AddHostedService<TasksService>();

            services.AddScoped<ITask, AutoCreateDaysOffTask>();
            services.AddScoped<AutoCreateDaysOffTask>();

            services.AddScoped<ITask, AutoCreateTracksTask>();
            services.AddScoped<AutoCreateTracksTask>();

            services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionScopedJobFactory();

                var autoCreateDaysOffTask = services.BuildServiceProvider().GetRequiredService<AutoCreateDaysOffTask>();
                q.AddJob<AutoCreateDaysOffTask>(configure => configure.WithIdentity(autoCreateDaysOffTask.JobKey));
                q.AddTrigger(configure => autoCreateDaysOffTask.ConfigureTriggerConfiguratorAsync(configure).GetAwaiter().GetResult());

                var autoCreateTracks = services.BuildServiceProvider().GetRequiredService<AutoCreateTracksTask>();
                q.AddJob<AutoCreateTracksTask>(configure => configure.WithIdentity(autoCreateTracks.JobKey));
                q.AddTrigger(configure => autoCreateTracks.ConfigureTriggerConfiguratorAsync(configure).GetAwaiter().GetResult());
            });
            return services;
        }

        public static IServiceCollection AddMsSql(this IServiceCollection services)
        {
            services.AddSingleton<DapperContext>();

            services.AddHostedService<DatabaseService>();
            services.AddSingleton<DatabaseService>();
            services.AddLogging(c => c.AddFluentMigratorConsole())
                .AddFluentMigratorCore()
                .ConfigureRunner(c => c.AddSqlServer2016()
                    .WithGlobalConnectionString(DapperContext.ConnectionString)
                    .ScanIn(Assembly.GetExecutingAssembly()).For.Migrations());

            services.AddScoped<CalendarDayRepository>();
            services.AddScoped<SettingsRepository>();
            services.AddScoped<AccessTokenRepository>();
            services.AddScoped<TrackRepository>();
            services.AddScoped<UserRepository>();
            services.AddScoped<ResetPassTokenRepository>();
            services.AddScoped<Users_UsersWhichCanApproveVacationRequestsRepository>();
            services.AddScoped<VacationRequestRepository>();
            services.AddScoped<ExcelExportRepository>();
            services.AddScoped<CompletedTaskRepository>();
            services.AddScoped<SickLeaveRepository>();
            return services;
        }

        public static IServiceCollection AddCaching(this IServiceCollection services)
        {
            services.AddMemoryCache();

            services.AddScoped<SettingsManager>();
            services.AddScoped<CalendarDayManager>();
            return services;
        }

        public static IServiceCollection AddInjectableServices(this IServiceCollection services)
        {
            var loadedAssemblies = AppDomain.CurrentDomain.GetAssemblies().ToList();
            var loadedPaths = loadedAssemblies.Where(a => !a.IsDynamic).Select(a => a.Location).ToArray();
            var referencedPaths = Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.dll");
            var toLoad = referencedPaths.Where(r => !loadedPaths.Contains(r, StringComparer.InvariantCultureIgnoreCase)).ToList();
            toLoad.ForEach(path => loadedAssemblies.Add(AppDomain.CurrentDomain.Load(AssemblyName.GetAssemblyName(path))));

            var implementationTypes = loadedAssemblies
                .SelectMany(asembly => asembly.GetTypes())
                .Where(type => type.IsDefined(typeof(InjectableServiceAttribute)));

            foreach (var implementationType in implementationTypes)
            {
                var injectableServiceAttribute = implementationType.GetCustomAttribute(typeof(InjectableServiceAttribute), true) as InjectableServiceAttribute;
                var serviceType = injectableServiceAttribute.ServiceType == null ? implementationType : injectableServiceAttribute.ServiceType;
                services.TryAdd(new ServiceDescriptor(serviceType, implementationType, injectableServiceAttribute.ServiceLifetime));
            }

            return services;
        }
    }
}
