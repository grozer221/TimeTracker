using MailKit.Net.Smtp;

using MimeKit;
using MimeKit.Text;

using TimeTracker.Server.Abstractions;
using TimeTracker.Server.DataAccess.Managers;

namespace TimeTracker.Server.Services
{
    public class EmailNotificationService : INotificationService
    {
        private readonly IServiceProvider serviceProvider;

        public EmailNotificationService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public async Task SendMessageAsync(string to, string title, string message)
        {
            using var scope = serviceProvider.CreateScope();
            var settingsManager = scope.ServiceProvider.GetRequiredService<SettingsManager>();
            var settings = await settingsManager.GetAsync();
            var name = settings.Email.Name;
            var address = settings.Email.Address ?? "no-reply@gmail.com";
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(name, address));
            emailMessage.To.Add(new MailboxAddress("", to));
            emailMessage.Subject = title;
            emailMessage.Body = new TextPart(TextFormat.Html)
            {
                Text = message
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(Environment.GetEnvironmentVariable("EMAIL_SMTP_SERVER"), int.Parse(Environment.GetEnvironmentVariable("EMAIL_PORT")), false);
                await client.AuthenticateAsync(Environment.GetEnvironmentVariable("EMAIL_USERNAME"), Environment.GetEnvironmentVariable("EMAIL_PASSWORD"));
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }
    }
}
