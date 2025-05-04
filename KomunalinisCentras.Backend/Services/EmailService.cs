using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace KomunalinisCentras.Backend.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _cfg;
        public EmailService(IConfiguration cfg) => _cfg = cfg;

        public async Task SendAsync(string to, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_cfg["Mail:User"]));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("plain") { Text = body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_cfg["Mail:Host"], int.Parse(_cfg["Mail:Port"]), SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_cfg["Mail:User"], _cfg["Mail:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
