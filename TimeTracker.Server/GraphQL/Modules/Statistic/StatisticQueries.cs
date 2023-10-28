using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.Services;

namespace TimeTracker.Server.GraphQL.Modules.Statistic
{
    public class StatisticQueries : ObjectGraphType
    {
        public StatisticQueries(ExcelExportRepository excelExportRepository, UserRepository userRepository, CalendarDaysService calendarService)
        {
            Field<StatisticType, StatisticModel>()
                .Name("GetUserStatistic")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("UserId", "User id")
                .Argument<NonNullGraphType<DateTimeGraphType>, DateTime>("Date", "year and month for tracks")
                .ResolveAsync(async context =>
                {
                    ExcelModel exelModel;
                    var userId = context.GetArgument<Guid>("UserId");
                    var date = context.GetArgument<DateTime>("Date");
                    var user = await userRepository.GetByIdAsync(userId);
                    exelModel = user.ToExcelModel();
                    await excelExportRepository.GetUserHours(userId, date, exelModel);
                    exelModel.MonthHours = await calendarService.GetAmountWorkingHoursInMonth(date);
                    exelModel.PersentOfWork = exelModel.WorkerHours / exelModel.MonthHours;
                    var statiscticModel = new StatisticModel()
                    {
                        WorkerHours = exelModel.WorkerHours,
                        MonthHours = exelModel.MonthHours
                    };
                    return statiscticModel;
                }).AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
