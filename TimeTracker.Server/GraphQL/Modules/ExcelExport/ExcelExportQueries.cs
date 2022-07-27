﻿using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;
using TimeTracker.Business.Models;
using TimeTracker.Business.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.Services;

namespace TimeTracker.Server.GraphQL.Modules.ExcelExport
{
    public class ExcelExportQueries : ObjectGraphType
    {
        public ExcelExportQueries(IExcelExportRepository excelExportRepository)
        {
            Field<BooleanGraphType, bool>()
                .Name("CreateReport")
                .Argument<NonNullGraphType<ExcelExportInputType>, ExcelExportInput>("ExcelExportInputType", "Argument for create exel report")
                .ResolveAsync(async context =>
                {
                    var excelExportInputType = context.GetArgument<ExcelExportInput>("ExcelExportInputType");
                    var models = await excelExportRepository.GetAsync(excelExportInputType.Like);
                    ExcelService excel = new ExcelService();
                    excel.CreateReport(excelExportInputType.Month, models);
                    return true;
                    
                }).AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
