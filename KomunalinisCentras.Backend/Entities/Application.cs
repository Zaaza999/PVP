using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class Application
    {
        [Key]
        [Column("application_id")]
        public int ApplicationId { get; set; }

        [Column("form_type")]
        [MaxLength(100)] 
        public string FormType { get; set; } = string.Empty;

        [Column("data", TypeName = "LONGTEXT")]
        public string DataJson { get; set; } = "{}";

        [NotMapped]
        public JsonObject Data
        {
            get => JsonNode.Parse(DataJson)?.AsObject() ?? new JsonObject();
            set => DataJson = value?.ToJsonString() ?? "{}";
        }

        [Column("submitted_at", TypeName = "datetime")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [Column("user_id")]
        public string SubmittedByUserId { get; set; }

        [JsonIgnore]
        public User? SubmittedBy { get; set; }
    }

}
