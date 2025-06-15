// Dtos/InvoiceDto.cs
namespace KomunalinisCentras.Backend.Dtos
{
    public record InvoiceDto(
        string Id,
        decimal Amount,
        decimal Remaining,           // ← NAUJAS laukas
        string Currency,
        string Topic,
        DateTime DueDate,
        string Status,
        DateTime? PaidAt,
        IEnumerable<PaymentDto> Payments
    );
}
