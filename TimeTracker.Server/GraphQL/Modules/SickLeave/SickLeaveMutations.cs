using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.SickLeave.DTO;
using TimeTracker.Server.Services;

namespace TimeTracker.Server.GraphQL.Modules.SickLeave
{
    public class SickLeaveMutations : ObjectGraphType
    {
        public SickLeaveMutations(
            IHttpContextAccessor httpContextAccessor,
            SickLeaveRepository sickLeaveRepository,
            IValidator<SickLeaveCreateInput> sickLeaveInputValidator,
            IValidator<SickLeaveUpdateInput> sickLeaveUpdateInputValidator,
            FileManagerService fileManagerService
            )
        {
            Field<NonNullGraphType<SickLeaveType>, SickLeaveModel>()
              .Name("Create")
              .Argument<NonNullGraphType<SickLeaveCreateInputType>, SickLeaveCreateInput>("SickLeaveCreateInputType", "")
              .ResolveAsync(async context =>
              {
                  var sickLeaveInput = context.GetArgument<SickLeaveCreateInput>("SickLeaveCreateInputType");
                  sickLeaveInputValidator.ValidateAndThrow(sickLeaveInput);

                  var sickLeave = sickLeaveInput.ToModel();

                  return await sickLeaveRepository.CreateAsync(sickLeave);
              })
              .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("Remove")
               .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "")
               .ResolveAsync(async context =>
               {
                   var id = context.GetArgument<Guid>("Id");
                   var sickLeave = await sickLeaveRepository.GetByIdAsync(id);
                   if (sickLeave == null)
                       throw new Exception("Vacation request not found");

                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministrator())
                       throw new ExecutionError("You can not remove sick leave days");

                   if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVacation))
                       throw new ExecutionError("You do not have permissions for remove sick leave days");

                   await sickLeaveRepository.RemoveAsync(id);

                   return true;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SickLeaveType>, SickLeaveModel>()
              .Name("Update")
              .Argument<NonNullGraphType<SickLeaveUpdateInputType>, SickLeaveUpdateInput>("SickLeaveUpdateInputType", "")
              .ResolveAsync(async context =>
              {
                  var sickLeaveUpdateInput = context.GetArgument<SickLeaveUpdateInput>("SickLeaveUpdateInputType");
                  sickLeaveUpdateInputValidator.ValidateAndThrow(sickLeaveUpdateInput);

                  if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVacation))
                      throw new ExecutionError("You do not have permissions for update sick leave days");

                  var sickLeave = sickLeaveUpdateInput.ToModel();
                  sickLeave = await sickLeaveRepository.UpdateAsync(sickLeave);

                  return await sickLeaveRepository.GetByIdAsync(sickLeave.Id);
              })
              .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SickLeaveType>, SickLeaveModel>()
              .Name("UploadFiles")
              .Argument<NonNullGraphType<SickLeaveUploadFilesInputType>, SickLeaveUploadFilesInput>("SickLeaveUploadFilesInputType", "")
              .ResolveAsync(async context =>
              {
                  var sickLeaveUploadFilesInput = context.GetArgument<SickLeaveUploadFilesInput>("SickLeaveUploadFilesInputType");
                  var oldSickLeave = await sickLeaveRepository.GetByIdAsync(sickLeaveUploadFilesInput.Id);

                  if (oldSickLeave == null)
                      throw new ExecutionError("Sick leave with current id does not exists");

                  var currentUserId = httpContextAccessor.HttpContext.GetUserId();
                  if (oldSickLeave.UserId != currentUserId)
                      if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.NoteTheAbsenceAndVacation))
                          throw new ExecutionError("You do not have permissions for update sick leave");
                  var files = new List<string>();
                  files.AddRange(sickLeaveUploadFilesInput.UploadedFiles);
                  foreach (var file in sickLeaveUploadFilesInput.UploadFiles)
                  {
                      var fileManagerItem = await fileManagerService.UploadFileAsync(FileManagerService.SickLeavesFolder, file, true);
                      files.Add(fileManagerItem.Path);
                  }
                  await sickLeaveRepository.UpdateFilesAsync(sickLeaveUploadFilesInput.Id, files);
                  return await sickLeaveRepository.GetByIdAsync(sickLeaveUploadFilesInput.Id);
              })
              .AuthorizeWith(AuthPolicies.Authenticated);

        }
    }
}
