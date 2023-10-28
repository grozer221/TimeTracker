using GraphQL.Types;

using TimeTracker.Business.Models;
using TimeTracker.Server.DataAccess.Managers;

namespace TimeTracker.Server.GraphQL.Modules.Settings
{
    public class SettingsQueries : ObjectGraphType
    {
        public SettingsQueries(SettingsManager settingsManager)
        {
            Field<NonNullGraphType<SettingsType>, SettingsModel>()
               .Name("Get")
               .ResolveAsync(async context => await settingsManager.GetAsync());
        }
    }
}
