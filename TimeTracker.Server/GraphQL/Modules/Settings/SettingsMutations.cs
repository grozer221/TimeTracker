using FluentValidation;

using GraphQL;
using GraphQL.Types;

using Quartz;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Settings.DTO;
using TimeTracker.Server.GraphQL.Modules.Settings.DTO.SettingsTasksUpdate;

namespace TimeTracker.Server.GraphQL.Modules.Settings
{
    public class SettingsMutations : ObjectGraphType
    {
        public SettingsMutations(
            SettingsManager settingsManager,
            IHttpContextAccessor httpContextAccessor,
            IValidator<SettingsEmploymentUpdateInput> settingsCommonUpdateInputValidator,
            IValidator<SettingsApplicationUpdateInput> settingsApplicationUpdateInputValidator,
            IValidator<SettingsEmailUpdateInput> settingsEmailUpdateInputValidator,
            IValidator<SettingsVacationRequestsUpdateInput> settingsVacationRequestsUpdateInputValidator,
            ISchedulerFactory schedulerFactory,
            IEnumerable<ITask> tasks
            )
        {
            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("UpdateEmployment")
               .Argument<NonNullGraphType<SettingsEmploymentUpdateInputType>, SettingsEmploymentUpdateInput>("SettingsEmploymentUpdateInputType", "Argument for update employment settings")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateSettings))
                       throw new ExecutionError("You do not have permissions for update employment settings");
                   var settingsEmploymentUpdateInputType = context.GetArgument<SettingsEmploymentUpdateInput>("SettingsEmploymentUpdateInputType");
                   settingsCommonUpdateInputValidator.ValidateAndThrow(settingsEmploymentUpdateInputType);
                   var settingsCommon = settingsEmploymentUpdateInputType.ToModel();
                   return await settingsManager.UpdateEmploymentAsync(settingsCommon);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("UpdateApplication")
               .Argument<NonNullGraphType<SettingsApplicationUpdateInputType>, SettingsApplicationUpdateInput>("SettingsApplicationUpdateInputType", "Argument for update application settings")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateSettings))
                       throw new ExecutionError("You do not have permissions for update application settings");
                   var settingsApplicationUpdateInput = context.GetArgument<SettingsApplicationUpdateInput>("SettingsApplicationUpdateInputType");
                   settingsApplicationUpdateInputValidator.ValidateAndThrow(settingsApplicationUpdateInput);
                   var settingsCommon = settingsApplicationUpdateInput.ToModel();
                   return await settingsManager.UpdateApplicationAsync(settingsCommon);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("UpdateTasks")
               .Argument<NonNullGraphType<SettingsTasksUpdateInputType>, SettingsTasksUpdateInput>("SettingsTasksUpdateInputType", "Argument for update tasks settings")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateSettings))
                       throw new ExecutionError("You do not have permissions for update tasks settings");
                   var settingsTasksUpdateInput = context.GetArgument<SettingsTasksUpdateInput>("SettingsTasksUpdateInputType");
                   var settingsCommon = settingsTasksUpdateInput.ToModel();
                   var newSettings = await settingsManager.UpdateTasksAsync(settingsCommon);

                   foreach (var task in tasks)
                   {
                       await task.RescheduleAsync();
                   }

                   return newSettings;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("UpdateEmail")
               .Argument<NonNullGraphType<SettingsEmailUpdateInputType>, SettingsEmailUpdateInput>("SettingsEmailUpdateInputType", "Argument for update tasks settings")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateSettings))
                       throw new ExecutionError("You do not have permissions for update email settings");
                   var settingsEmailUpdateInput = context.GetArgument<SettingsEmailUpdateInput>("SettingsEmailUpdateInputType");
                   settingsEmailUpdateInputValidator.ValidateAndThrow(settingsEmailUpdateInput);
                   var settingsEmail = settingsEmailUpdateInput.ToModel();
                   return await settingsManager.UpdateEmailAsync(settingsEmail);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("UpdateVacationRequests")
               .Argument<NonNullGraphType<SettingsVacationRequestsUpdateInputType>, SettingsVacationRequestsUpdateInput>("SettingsVacationRequestsUpdateInputType", "Argument for update tasks settings")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateSettings))
                       throw new ExecutionError("You do not have permissions for update vacation requests settings");
                   var settingsVacationRequestsUpdateInput = context.GetArgument<SettingsVacationRequestsUpdateInput>("SettingsVacationRequestsUpdateInputType");
                   settingsVacationRequestsUpdateInputValidator.ValidateAndThrow(settingsVacationRequestsUpdateInput);
                   var settingsVacationRequests = settingsVacationRequestsUpdateInput.ToModel();
                   return await settingsManager.UpdateVacationRequestsAsync(settingsVacationRequests);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
