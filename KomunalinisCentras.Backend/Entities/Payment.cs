using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Text.Json.Serialization;

namespace KomunalinisCentras.Backend.Entities
{
    public class Payment
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Column("invoice_id")]
        public int InvoiceId { get; set; }

        [Column("Provider")]
        public string Provider { get; set; } = default!;

        [Column("ProviderTxnId")]
        public string ProviderTxnId { get; set; } = default!;

        [Column("Amount")]
        public decimal Amount { get; set; }

        [Column("Currency")]
        public string Currency { get; set; } = "EUR";

        [Column("Status")]
        public PaymentStatus Status { get; set; } = PaymentStatus.Initiated;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("RawPayload", TypeName = "json")]
        public string? RawPayload { get; set; }  // saugome JSON tekstą

        [JsonIgnore]
        public Invoice? Invoice { get; set; }
    }

    public enum PaymentStatus { Initiated, InProgress, Succeeded, Failed, Refunded }
}
