using TimeTracker.Business.Enums;
using TimeTracker.Server.DataAccess.Managers;
using TimeTracker.Server.DataAccess.Repositories;

namespace TimeTracker.Server.Services
{
    public class VacationRequestsService
    {
        private readonly UserRepository userRepository;
        private readonly VacationRequestRepository vacationRequestRepository;
        private readonly SettingsManager settingsManager;

        public VacationRequestsService(UserRepository userRepository, VacationRequestRepository vacationRequestRepository, SettingsManager settingsManager)
        {
            this.userRepository = userRepository;
            this.vacationRequestRepository = vacationRequestRepository;
            this.settingsManager = settingsManager;
        }

        public async Task<int> GetAvaliableDaysAsync(Guid userId)
        {
            var currentUser = await userRepository.GetByIdAsync(userId);
            var dateOfEmployment = currentUser.CreatedAt;
            var employedYears = new DateTime((DateTime.Now - dateOfEmployment).Ticks).Year - 1;
            if (employedYears < 1)
                return 0;

            var dateOfEmploymentPlusEmployedYears = dateOfEmployment.AddYears(employedYears);
            var dateOfEmploymentPlusEmployedYearsPlus1 = dateOfEmploymentPlusEmployedYears.AddYears(1);
            var currentYearVacationRequests = await vacationRequestRepository.GetAsync(userId, dateOfEmploymentPlusEmployedYears, dateOfEmploymentPlusEmployedYearsPlus1);
            currentYearVacationRequests = currentYearVacationRequests.Where(v => v.Status != VacationRequestStatus.NotApproved);
            var currentYearUsedVacationDays = 0;
            foreach (var currentYearVacationRequest in currentYearVacationRequests)
                currentYearUsedVacationDays += (int)(currentYearVacationRequest.DateEnd - currentYearVacationRequest.DateStart).TotalDays + 1;

            var settings = await settingsManager.GetAsync();
            var vacationDaysPerYear = settings.VacationRequests.AmountDaysPerYear;
            if (currentYearUsedVacationDays >= vacationDaysPerYear)
                return 0;

            return vacationDaysPerYear - currentYearUsedVacationDays;
        }
    }
}
