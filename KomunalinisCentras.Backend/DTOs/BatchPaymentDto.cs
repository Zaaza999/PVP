namespace KomunalinisCentras.Backend.Dtos
{
    public record BatchPaymentItem(int InvoiceId, decimal Amount);
    public record BatchPaymentDto(IList<BatchPaymentItem> Items);
}
