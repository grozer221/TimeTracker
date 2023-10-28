using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using TimeTracker.Business.Abstractions;
using TimeTracker.Business.Enums;

namespace TimeTracker.Business.Models
{
    public class UserModel : BaseModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public int RoleNumber { get; private set; }
        public Role Role
        {
            get => (Role)RoleNumber;
            set => RoleNumber = (int)value;
        }
        public string PermissionsString { get; private set; }
        public IEnumerable<Permission> Permissions
        {
            get => JsonConvert.DeserializeObject<IEnumerable<Permission>>(PermissionsString);
            set => PermissionsString = JsonConvert.SerializeObject(value, new StringEnumConverter());
        }
        public Employment Employment { get; set; }

        public IEnumerable<UserModel> UsersWhichCanApproveVacationRequest { get; set; } = new List<UserModel>();

        public ExcelModel ToExcelModel()
        {
            ExcelModel excelModel = new ExcelModel()
            {
                UserInitials = $"{this.LastName} {this.FirstName} {this.MiddleName}",
                Employment = this.Employment
            };

            return excelModel;
        }
    }
}
