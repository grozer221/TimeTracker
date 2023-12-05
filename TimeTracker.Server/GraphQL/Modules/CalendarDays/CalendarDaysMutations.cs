using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays
{
    public class CalendarDaysMutations : ObjectGraphType
    {
        public CalendarDaysMutations(
            CalendarDayManager calendarDayManager,
            IHttpContextAccessor httpContextAccessor,
            IValidator<CalendarDaysCreateInput> calendarDaysCreateInputValidator,
            IValidator<CalendarDaysCreateRangeInput> calendarDaysCreateRangeInputValidator,
            IValidator<CalendarDaysUpdateInput> calendarDaysUpdateInputValidator,
            IValidator<CalendarDaysRemoveRangeInput> calendarDaysRemoveRangeInputValidator)
        {
            Field<NonNullGraphType<CalendarDayType>, CalendarDayModel>()
               .Name("Create")
               .Argument<NonNullGraphType<CalendarDaysCreateInputType>, CalendarDaysCreateInput>("CalendarDaysCreateInputType", "Argument for create calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for create calendar day");
                   var calendarDaysCreateInput = context.GetArgument<CalendarDaysCreateInput>("CalendarDaysCreateInputType");
                   await calendarDaysCreateInputValidator.ValidateAndThrowAsync(calendarDaysCreateInput);
                   var calendarDay = calendarDaysCreateInput.ToModel();
                   return await calendarDayManager.CreateAsync(calendarDay);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<CalendarDayType>>, IEnumerable<CalendarDayModel>>()
               .Name("CreateRange")
               .Argument<NonNullGraphType<CalendarDaysCreateRangeInputType>, CalendarDaysCreateRangeInput>("CalendarDaysCreateRangeInputType", "Argument for create calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for create calendar day");

                   var calendarDaysCreateRangeInput = context.GetArgument<CalendarDaysCreateRangeInput>("CalendarDaysCreateRangeInputType");
                   await calendarDaysCreateRangeInputValidator.ValidateAndThrowAsync(calendarDaysCreateRangeInput);
                   var calendarDays = await calendarDaysCreateRangeInput.ToListAsync(calendarDayManager);
                   var createdCalendarDays = new List<CalendarDayModel>();
                   foreach (var calendarDay in calendarDays)
                   {
                       var createdCalendarDay = await calendarDayManager.CreateAsync(calendarDay);
                       createdCalendarDays.Add(createdCalendarDay);
                   }
                   return createdCalendarDays;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<CalendarDayType>, CalendarDayModel>()
               .Name("Update")
               .Argument<NonNullGraphType<CalendarDaysUpdateInputType>, CalendarDaysUpdateInput>("CalendarDaysUpdateInputType", "Argument for update calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for update calendar day");
                   var calendarDaysUpdateInput = context.GetArgument<CalendarDaysUpdateInput>("CalendarDaysUpdateInputType");
                   await calendarDaysUpdateInputValidator.ValidateAndThrowAsync(calendarDaysUpdateInput);
                   var calendarDay = calendarDaysUpdateInput.ToModel();
                   return await calendarDayManager.UpdateAsync(calendarDay);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<CalendarDayType>, CalendarDayModel>()
               .Name("Remove")
               .Argument<NonNullGraphType<DateGraphType>, DateTime>("Date", "Argument for remove calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for remove calendar day");
                   var date = context.GetArgument<DateTime>("Date");
                   return await calendarDayManager.RemoveAsync(date);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<CalendarDayType>>, IEnumerable<CalendarDayModel>>()
               .Name("RemoveRange")
               .Argument<NonNullGraphType<CalendarDaysRemoveRangeInputType>, CalendarDaysRemoveRangeInput>("CalendarDaysRemoveRangeInputType", "Argument for remove calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for remove calendar day");
                   var calendarDaysRemoveRangeInput = context.GetArgument<CalendarDaysRemoveRangeInput>("CalendarDaysRemoveRangeInputType");
                   await calendarDaysRemoveRangeInputValidator.ValidateAndThrowAsync(calendarDaysRemoveRangeInput);
                   var dates = await calendarDaysRemoveRangeInput.ToDatesListAsync(calendarDayManager);
                   var removedCalendarDays = new List<CalendarDayModel>();
                   foreach (var date in dates)
                   {
                       var removedCalendarDay = await calendarDayManager.RemoveAsync(date);
                       removedCalendarDays.Add(removedCalendarDay);
                   }
                   return removedCalendarDays;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
