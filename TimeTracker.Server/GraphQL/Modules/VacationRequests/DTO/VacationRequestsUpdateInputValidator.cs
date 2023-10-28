using FluentValidation;

using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.GraphQL.Modules.VacationRequests.DTO
{
    public class VacationRequestsUpdateInputValidator : AbstractValidator<VacationRequestsUpdateInput>
    {
        public VacationRequestsUpdateInputValidator(VacationRequestRepository vacationRequestRepository)
        {
            RuleFor(l => l.Id)
                .NotNull()
                .MustAsync(async (id, _) =>
                {
                    var vacationRequest = await vacationRequestRepository.GetByIdAsync(id);
                    return vacationRequest != null;
                }).WithMessage("Vacation request with current id does not exsits");

            RuleFor(l => l.DateStart)
                .NotNull()
                .Must((input, dateStart) =>
                {
                    var dateTimeNow = DateTime.Now;
                    var dateNow = new DateTime(dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day);
                    var result = DateTime.Compare(dateNow, dateStart);
                    return result <= 0;
                }).WithMessage("Date start can not be in the past");

            RuleFor(l => l.DateEnd)
                .NotNull()
                .Must((input, to) =>
                {
                    var result = DateTime.Compare(input.DateStart, input.DateEnd);
                    return result < 0;
                }).WithMessage("Date end must be greater than date start");

            RuleFor(l => l.Comment);
        }
    }
}
