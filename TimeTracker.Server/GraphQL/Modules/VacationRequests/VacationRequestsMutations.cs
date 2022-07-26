﻿using FluentValidation;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.VacationRequests.DTO;
using TimeTracker.Server.Services;

namespace TimeTracker.Server.GraphQL.Modules.VacationRequests
{
    public class VacationRequestsMutations : ObjectGraphType
    {
        public VacationRequestsMutations(
            IVacationRequestRepository vacationRequestRepository,
            IHttpContextAccessor httpContextAccessor,
            IValidator<VacationRequestsCreateInput> vacationRequestsCreateInputValidator,
            IValidator<VacationRequestsUpdateInput> vacationRequestsUpdateInputValidator,
            IValidator<VacationRequestsUpdateStatusInput> vacationRequestsUpdateStatusInputValidator,
            VacationRequestsService vacationRequestsService
            )
        {
            Field<NonNullGraphType<VacationRequestType>, VacationRequestModel>()
               .Name("Create")
               .Argument<NonNullGraphType<VacationRequestsCreateInputType>, VacationRequestsCreateInput>("VacationRequestsCreateInputType", "")
               .ResolveAsync(async context =>
               {
                   var vacationRequestsCreateInput = context.GetArgument<VacationRequestsCreateInput>("VacationRequestsCreateInputType");
                   vacationRequestsCreateInputValidator.ValidateAndThrow(vacationRequestsCreateInput);

                   var currentUserId = httpContextAccessor.HttpContext.GetUserId();
                   var avaliableDays = await vacationRequestsService.GetAvaliableDaysAsync(currentUserId);
                   var vacationRequestDays = (int)(vacationRequestsCreateInput.DateEnd - vacationRequestsCreateInput.DateStart).TotalDays;
                   if (avaliableDays - vacationRequestDays < 0)
                       throw new Exception("You do not have enough avaliable days for vacation request");

                   var vacationRequest = vacationRequestsCreateInput.ToModel();
                   vacationRequest.Status = VacationRequestStatus.New;
                   vacationRequest.UserId = currentUserId;
                   return await vacationRequestRepository.CreateAsync(vacationRequest);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<VacationRequestType>, VacationRequestModel>()
               .Name("Update")
               .Argument<NonNullGraphType<VacationRequestsUpdateInputType>, VacationRequestsUpdateInput>("VacationRequestsUpdateInputType", "")
               .ResolveAsync(async context =>
               {
                   var vacationRequestsUpdateInput = context.GetArgument<VacationRequestsUpdateInput>("VacationRequestsUpdateInputType");
                   await vacationRequestsUpdateInputValidator.ValidateAndThrowAsync(vacationRequestsUpdateInput);
                   var vacationRequest = vacationRequestsUpdateInput.ToModel();
                   var oldVacationRequest = await vacationRequestRepository.GetByIdAsync(vacationRequest.Id);
                   var currentUserId = httpContextAccessor.HttpContext.GetUserId();
                   if (oldVacationRequest.UserId != currentUserId)
                       if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVocation))
                           throw new ExecutionError("You do not have permissions for update vacation request");

                   Guid userIdForGetAvaliableDays;
                   if (oldVacationRequest.UserId == currentUserId)
                   {
                       userIdForGetAvaliableDays = currentUserId;
                   }
                   else
                   {
                       userIdForGetAvaliableDays = oldVacationRequest.UserId;
                   }

                   var avaliableDays = await vacationRequestsService.GetAvaliableDaysAsync(userIdForGetAvaliableDays);
                   var vacationRequestDays = (int)(vacationRequestsUpdateInput.DateEnd - vacationRequestsUpdateInput.DateStart).TotalDays;
                   if (avaliableDays - vacationRequestDays < 0)
                       throw new Exception("You do not have enough avaliable days for vacation request");

                   return await vacationRequestRepository.UpdateAsync(vacationRequest);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<VacationRequestType>, VacationRequestModel>()
               .Name("UpdateStatus")
               .Argument<NonNullGraphType<VacationRequestsUpdateStatusInputType>, VacationRequestsUpdateStatusInput>("VacationRequestsUpdateStatusInputType", "")
               .ResolveAsync(async context =>
               {
                   var vacationRequestsUpdateStatusInput = context.GetArgument<VacationRequestsUpdateStatusInput>("VacationRequestsUpdateStatusInputType");
                   await vacationRequestsUpdateStatusInputValidator.ValidateAndThrowAsync(vacationRequestsUpdateStatusInput);
                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVocation))
                       throw new ExecutionError("You do not have permissions for update status vacation request");
                   await vacationRequestRepository.UpdateStatusAsync(vacationRequestsUpdateStatusInput.Id, vacationRequestsUpdateStatusInput.Status);
                   return await vacationRequestRepository.GetByIdAsync(vacationRequestsUpdateStatusInput.Id);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("Remove")
               .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "")
               .ResolveAsync(async context =>
               {
                   var id = context.GetArgument<Guid>("Id");
                   var vacationRequest = await vacationRequestRepository.GetByIdAsync(id);
                   if (vacationRequest == null)
                       throw new Exception("Vacation request not found");

                   var currentUserId = httpContextAccessor.HttpContext.GetUserId();
                   if (vacationRequest.UserId != currentUserId)
                       if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVocation))
                           throw new ExecutionError("You do not have permissions for update vacation request");

                   await vacationRequestRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
