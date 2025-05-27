// Dtos/InvoiceDto.cs
namespace KomunalinisCentras.Backend.Dtos
{
    public record InvoiceDto(
        int Id,
        decimal Amount,
        decimal Remaining,           // ← NAUJAS laukas
        string Currency,
        DateTime DueDate,
        string Status,
        DateTime? PaidAt,
        IEnumerable<PaymentDto> Payments
    );
}
