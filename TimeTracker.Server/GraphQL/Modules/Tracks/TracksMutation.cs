﻿using FluentValidation;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Tracks.DTO;

namespace TimeTracker.Server.GraphQL.Modules.Tracks
{
    public class TracksMutation : ObjectGraphType
    {
        public TracksMutation(ITrackRepository trackRepository, 
                              IHttpContextAccessor httpContextAccessor, 
                              IUserRepository userRepository,
                              IValidator<TrackInput> trackInputTypeValidator,
                              IValidator<TrackOtherInput> trackOtherInputTypeValidator,
                              IValidator<TrackUpdateInput> trackUpdateInputTypeValidator,
                              IValidator<TrackRemoveInput> trackRemoveInputTypeValidator)
        {

            Field<NonNullGraphType<TrackType>, TrackModel>()
                .Name("Create")
                .Argument<NonNullGraphType<TrackInputType>, TrackInput>("TrackInput", "Argument for create track")
                .ResolveAsync(async context =>
                {
                    var track = context.GetArgument<TrackInput>("TrackInput");
                    await trackInputTypeValidator.ValidateAndThrowAsync(track);
                    var model = track.ToModel();
                    model.Id = Guid.NewGuid();
                    model.UserId = httpContextAccessor.HttpContext.GetUserId();

                    return await trackRepository.CreateAsync(model);
                }).AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<TrackType>, TrackModel>()
                .Name("CreateOther")
                .Argument<NonNullGraphType<TrackOtherInputType>, TrackOtherInput>("TrackInput", "Argument for create track")
                .ResolveAsync(async context =>
                {
                    var track = context.GetArgument<TrackOtherInput>("TrackInput");
                    var user = await userRepository.GetByIdAsync(track.UserId);

                    if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateOthersTimeTracker) || user == null)
                        throw new ExecutionError("You do not have permissions for create others tracks");
                    await trackOtherInputTypeValidator.ValidateAndThrowAsync(track);
                    var model = track.ToModel();

                    model.Id = Guid.NewGuid();

                    return await trackRepository.CreateAsync(model);
                }).AuthorizeWith(AuthPolicies.Authenticated);

            Field<StringGraphType>()
                .Name("Remove")
                .Argument<NonNullGraphType<TrackRemoveInputType>, TrackRemoveInput>("TrackInput", "Argument for delete track")
                .ResolveAsync(async context =>
                {
                    var trackInput = context.GetArgument<TrackRemoveInput>("TrackInput");
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    await trackRemoveInputTypeValidator.ValidateAndThrowAsync(trackInput);
                    var model = await trackRepository.GetByIdAsync(trackInput.Id);
                    if (model.UserId != userId)
                        if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateOthersTimeTracker))
                            throw new ExecutionError("You do not have permissions for delete others tracks");

                    await trackRepository.RemoveAsync(trackInput.Id);

                    return "Deleted";
                }).AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<TrackType>, TrackModel>()
                .Name("Update")
                .Argument<NonNullGraphType<TrackUpdateInputType>, TrackUpdateInput>("TrackInput", "Argument for update track")
                .ResolveAsync(async context =>
                {
                    var track = context.GetArgument<TrackUpdateInput>("TrackInput");
                    var userId = httpContextAccessor.HttpContext.GetUserId();
                    await trackUpdateInputTypeValidator.ValidateAndThrowAsync(track);
                    var model = await trackRepository.GetByIdAsync(track.Id);
                    if (track.Title != null)
                        model.Title = track.Title;
                    if (track.StartTime != null)
                        model.StartTime = track.StartTime;
                    if (track.EndTime != null)
                        model.EndTime = track.EndTime;
                    
                    if (!httpContextAccessor.HttpContext.User.Claims.IsAdministratOrHavePermissions(Permission.UpdateOthersTimeTracker) && model.UserId != userId)
                        throw new ExecutionError("You do not have permissions for update others tracks");

                    return await trackRepository.UpdateAsync(model);
                }).AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
