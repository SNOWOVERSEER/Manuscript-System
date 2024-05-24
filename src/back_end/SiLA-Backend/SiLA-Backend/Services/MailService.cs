using Mailjet.Client;
using Mailjet.Client.Resources;
using Newtonsoft.Json.Linq;
using SiLA_Backend.Models;
using SiLA_Backend.Utilities;
using System.Threading.Tasks;

namespace SiLA_Backend.Services
{
    public class MailService
    {
        private readonly string _apiKey;
        private readonly string _apiSecret;

        public MailService(IConfiguration configuration)
        {
            var mailjetSettings = configuration.GetSection("Mailjet").Get<MailjetSettings>();
            _apiKey = mailjetSettings!.ApiKey;
            _apiSecret = mailjetSettings!.ApiSecret;
        }

        public async Task SendEmailAsync(Email_Model model)
        {
            try
            {
                await SendTemplateEmailAsync(
                    model.To,
                    model.ToName,
                    model.Subject,
                    model.TemplateId,
                    model.Variables
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }

        private async Task SendTemplateEmailAsync(string toEmail, string toName, string subject, long templateId, JObject variables)
        {
            MailjetClient client = new MailjetClient(_apiKey, _apiSecret);

            MailjetRequest request = new MailjetRequest
            {
                Resource = Send.Resource,
            }
            .Property(Send.FromEmail, "sila.email.bot@gmail.com")
            .Property(Send.FromName, "SILA No-Reply")
            .Property(Send.Subject, subject)
            .Property(Send.MjTemplateID, templateId)
            .Property(Send.MjTemplateLanguage, true)
            .Property(Send.Vars, variables)
            .Property(Send.Recipients, new JArray {
                new JObject {
                    {"Email", toEmail},
                    {"Name", toName}
                }
            });

            MailjetResponse response = await client.PostAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Email sent successfully to {toEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to send email. StatusCode: {response.StatusCode}\nErrorInfo: {response.GetErrorInfo()}");
                Console.WriteLine(response.GetData());
                Console.WriteLine($"ErrorMessage: {response.GetErrorMessage()}");
            }
        }


    }

}