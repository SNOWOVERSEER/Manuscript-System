using Newtonsoft.Json.Linq;

namespace SiLA_Backend.Models
{
    public class Email_Model
    {
        public string To { get; set; }
        public string ToName { get; set; }
        public string Subject { get; set; }
        public int TemplateId { get; set; }
        public JObject Variables { get; set; }
    }
}