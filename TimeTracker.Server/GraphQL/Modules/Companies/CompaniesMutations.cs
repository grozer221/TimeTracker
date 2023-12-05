using FluentValidation;

using GraphQL;
using GraphQL.Types;

using TimeTracker.Business.Enums;
using TimeTracker.Business.Models;
using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.Extensions;
using TimeTracker.Server.GraphQL.Modules.Auth;
using TimeTracker.Server.GraphQL.Modules.Companies.Types;

namespace TimeTracker.Server.GraphQL.Modules.Companies
{
    public class CompaniesMutations : ObjectGraphType
    {
        public CompaniesMutations(
            CompanyRepository companyRepository,
            IValidator<CompanyInput> companyInputValidator,
            INotificationService notificationService,
            UserRepository userRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<CompanyType>>()
              .Name("Create")
              .Argument<NonNullGraphType<CompanyInputType>>("input", "")
              .ResolveAsync(async context =>
              {
                  var input = context.GetArgument<CompanyInput>("input");
                  companyInputValidator.ValidateAndThrow(input);

                  var company = input.ToModel();
                  company = await companyRepository.CreateAsync(company);

                  var password = "12345";
                  var hashedPassword = password.CreateMD5WithSalt(out var salt);
                  var user = new UserModel
                  {
                      Email = company.Email,
                      FirstName = "Admin",
                      LastName = company.Name,
                      MiddleName = company.Name,
                      Password = hashedPassword,
                      Salt = salt,
                      Role = Role.Admin,
                      CompanyId = company.Id,
                      Permissions = new List<Permission>(),
                  };

                  user = await userRepository.CreateAsync(user);
                  var message = $"Your company \"{company.Name}\" has been created.\nAdmin creadentials for login:\nEmail: {user.Email}\nPassword: {password}";
                  await notificationService.SendMessageAsync(company.Email, "Company has been created", message);
                  await notificationService.SendMessageAsync(httpContextAccessor.HttpContext.GetUserEmail(), "Company has been created", message);

                  return company;
              })
              .AuthorizeWith(AuthPolicies.SuperAdmin);

            Field<NonNullGraphType<CompanyType>>()
                .Name("Update")
                .Argument<NonNullGraphType<GuidGraphType>>("id", "")
                .Argument<NonNullGraphType<CompanyInputType>>("input", "")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("id");
                    var input = context.GetArgument<CompanyInput>("input");
                    companyInputValidator.ValidateAndThrow(input);

                    var company = await companyRepository.GetByIdAsync(id)
                        ?? throw new Exception("Company not found");

                    company.Name = input.Name;
                    company.Email = input.Email;

                    return await companyRepository.UpdateAsync(company);
                })
                .AuthorizeWith(AuthPolicies.SuperAdmin);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("Remove")
               .Argument<NonNullGraphType<GuidGraphType>, Guid>("Id", "")
               .ResolveAsync(async context =>
               {
                   var id = context.GetArgument<Guid>("Id");
                   var company = await companyRepository.GetByIdAsync(id)
                       ?? throw new Exception("Company not found");

                   await companyRepository.RemoveAsync(company.Id);

                   return true;
               })
               .AuthorizeWith(AuthPolicies.SuperAdmin);
        }
    }
}
