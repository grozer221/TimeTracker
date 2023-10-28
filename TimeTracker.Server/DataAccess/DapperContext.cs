using Dapper;

using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

using TimeTracker.Server.DataAccess.TypeHandlers;

namespace TimeTracker.Server.DataAccess
{
    public class DapperContext
    {
        public static string DatabaseName
        {
            get => Regex.Match(ConnectionString, @"Initial Catalog=(\w+);").Groups[1].Value;
        }

        public static string ConnectionString
        {
            get => Environment.GetEnvironmentVariable("MS_SQL_CONNECTION_STRING");
        }

        public IDbConnection CreateConnection()
        {
            SqlMapper.AddTypeHandler(new DateTimeTypeHandler());
            return new SqlConnection(ConnectionString);
        }
    }
}
