namespace KomunalinisCentras.Backend.Dtos
{
    public record PaymentDto(
        int    PaymentId,
        decimal Amount,
        string Currency,
        string Provider,
        string ProviderTxnId,
        string Status,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}