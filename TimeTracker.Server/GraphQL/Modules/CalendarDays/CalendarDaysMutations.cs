﻿using GraphQL;
using GraphQL.Types;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.CalendarDays.DTO;

namespace TimeTracker.Server.GraphQL.Modules.CalendarDays
{
    public class CalendarDaysMutations : ObjectGraphType
    {
        public CalendarDaysMutations(ICalendarDayRepository calendarDayRepository, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<CalendarDayType>, CalendarDayModel>()
               .Name("Create")
               .Argument<NonNullGraphType<CalendarDaysCreateInputType>, CalendarDaysCreateInput>("CalendarDaysCreateInputType", "Argument for create calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for create calendar day");
                   var calendarDaysCreateInput = context.GetArgument<CalendarDaysCreateInput>("CalendarDaysCreateInputType");
                   await new CalendarDaysCreateInputValidation(calendarDayRepository).ValidateAndThrowExceptionsAsync(calendarDaysCreateInput);
                   var calendarDay = calendarDaysCreateInput.ToModel();
                   return await calendarDayRepository.CreateAsync(calendarDay);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<CalendarDayType>>, IEnumerable<CalendarDayModel>>()
               .Name("CreateRange")
               .Argument<NonNullGraphType<CalendarDaysCreateRangeInputType>, CalendarDaysCreateRangeInput>("CalendarDaysCreateRangeInput", "Argument for create calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for create calendar day");
                   var calendarDaysCreateRangeInput = context.GetArgument<CalendarDaysCreateRangeInput>("CalendarDaysCreateRangeInput");
                   new CalendarDaysCreateRangeInputValidation().ValidateAndThrowExceptions(calendarDaysCreateRangeInput);
                   var calendarDays = await calendarDaysCreateRangeInput.ToListAsync(calendarDayRepository);
                   var createdCalendarDays = new List<CalendarDayModel>();
                   foreach (var calendarDay in calendarDays)
                   {
                       var createdCalendarDay = await calendarDayRepository.CreateAsync(calendarDay);
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
                   if (!httpContextAccessor.HttpContext.IsAdministratOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for update calendar day");
                   var calendarDaysUpdateInput = context.GetArgument<CalendarDaysUpdateInput>("CalendarDaysUpdateInputType");
                   new CalendarDaysUpdateInputValidation().ValidateAndThrowExceptions(calendarDaysUpdateInput);
                   var calendarDay = calendarDaysUpdateInput.ToModel();
                   return await calendarDayRepository.UpdateAsync(calendarDay);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<CalendarDayType>, CalendarDayModel>()
               .Name("Remove")
               .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "Argument for remove calendar day")
               .ResolveAsync(async context =>
               {
                   if (!httpContextAccessor.HttpContext.IsAdministratOrHavePermissions(Permission.UpdateCalendar))
                       throw new ExecutionError("You do not have permissions for remove calendar day");
                   var id = context.GetArgument<Guid>("Id");
                   return await calendarDayRepository.RemoveAsync(id);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}