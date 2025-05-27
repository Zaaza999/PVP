using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;   
using System.Text.Json.Serialization; 


namespace KomunalinisCentras.Backend.Entities
{
    public class Invoice
    {
        [Key]
        [Column("invoice_id")]
        public int Id { get; set; }

        [Column("UserId")]
        public string UserId { get; set; } = default!;

        [Column("Amount")]
        public decimal Amount { get; set; }

        [Column("Currency")]
        public string Currency { get; set; } = "EUR";

        [Column("DueDate")]
        public DateTime DueDate { get; set; }

        [Column("Status")]
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Issued;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; }

        [Column("PaidAt")]
        public DateTime? PaidAt { get; set; }

        [JsonIgnore]
        public ICollection<Payment> Payments { get; set; } 
        
    }

    public enum InvoiceStatus { Issued, Pending, Paid, Cancelled }
}