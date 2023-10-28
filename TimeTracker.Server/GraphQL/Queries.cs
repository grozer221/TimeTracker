using GraphQL.Types;

using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.CalendarDays;
using TimeTracker.Server.GraphQL.Modules.Companies;
using TimeTracker.Server.GraphQL.Modules.ExcelExport;
using TimeTracker.Server.GraphQL.Modules.FileManager;
using TimeTracker.Server.GraphQL.Modules.Settings;
using TimeTracker.Server.GraphQL.Modules.SickLeave;
using TimeTracker.Server.GraphQL.Modules.Statistic;
using TimeTracker.Server.GraphQL.Modules.Tracks;
using TimeTracker.Server.GraphQL.Modules.Users;
using TimeTracker.Server.GraphQL.Modules.VacationRequests;

namespace TimeTracker.Server.GraphQL
{
    public class Queries : ObjectGraphType
    {
        public Queries()
        {
            Field<NonNullGraphType<AuthQueries>>()
                .Name("Auth")
                .Resolve(_ => new { });

            Field<NonNullGraphType<TracksQueries>>()
                .Name("Tracks")
                .Resolve(_ => new { });

            Field<NonNullGraphType<UsersQueries>>()
                .Name("Users")
                .Resolve(_ => new { });

            Field<NonNullGraphType<CalendarDaysQueries>>()
                .Name("CalendarDays")
                .Resolve(_ => new { });

            Field<NonNullGraphType<SettingsQueries>>()
                .Name("Settings")
                .Resolve(_ => new { });

            Field<NonNullGraphType<FileManagerQueries>>()
                .Name("FileManager")
                .Resolve(_ => new { });

            Field<NonNullGraphType<VacationRequestsQueries>>()
                .Name("VacationRequests")
                .Resolve(_ => new { });

            Field<NonNullGraphType<ExcelExportQueries>>()
                .Name("ExcelExport")
                .Resolve(_ => new { });

            Field<NonNullGraphType<StatisticQueries>>()
                .Name("Statistic")
                .Resolve(_ => new { });

            Field<NonNullGraphType<SickLeaveQueries>>()
                .Name("SickLeave")
                .Resolve(_ => new { });

            Field<NonNullGraphType<CompaniesQueries>>()
                .Name("Companies")
                .Resolve(_ => new { });
        }
    }
}
