using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Filters;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Abstractions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.SickLeave.DTO;

namespace TimeTracker.Server.GraphQL.Modules.SickLeave
{
    public class SickLeaveQueries : ObjectGraphType
    {
        public SickLeaveQueries(
            IHttpContextAccessor httpContextAccessor,
            SickLeaveRepository sickLeaveRepository,
            IValidator<SickLeaveGetInput> sickLeaveGetInputValidator
            )
        {
            Field<NonNullGraphType<GetEntitiesResponseType<SickLeaveType, SickLeaveModel>>, GetEntitiesResponse<SickLeaveModel>>()
               .Name("Get")
               .Argument<NonNullGraphType<SickLeaveGetInputType>, SickLeaveGetInput>("SickLeaveGetInputType", "Argument represent sick leave model for get")
               .ResolveAsync(async context =>
               {
                   var sickLeaveGetInput = context.GetArgument<SickLeaveGetInput>("SickLeaveGetInputType");
                   if (!httpContextAccessor.HttpContext.IsAdministratorOrHavePermissions(Permission.NoteTheAbsenceAndVacation) && sickLeaveGetInput.Filter.Kind == SickLeaveFilterKind.All)
                       throw new ExecutionError("You can not get all sick leave requests");
                   sickLeaveGetInputValidator.ValidateAndThrow(sickLeaveGetInput);
                   var currentUserId = httpContextAccessor.HttpContext.GetUserId();

                   return await sickLeaveRepository.GetAsync(sickLeaveGetInput.PageNumber, sickLeaveGetInput.PageSize, sickLeaveGetInput.Filter, currentUserId);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SickLeaveType>, SickLeaveModel>()
                .Name("GetById")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "Id of sick leave day")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("Id");
                    var sickLeave = await sickLeaveRepository.GetByIdAsync(id);
                    if (sickLeave == null)
                        throw new ExecutionError("Sick leave request not found");

                    return sickLeave;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
