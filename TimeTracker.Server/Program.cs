using TimeTracker.MsSql.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", builder =>
    {
        builder.AllowAnyHeader()
               .WithMethods("POST")
               .WithOrigins("http://localhost:3000")
               .AllowCredentials();
    });
});

builder.Services.AddMsSql();


var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

//app.UseGraphQL<AppSchema>();
//app.UseGraphQLAltair();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "wwwroot";
});

app.Run();
