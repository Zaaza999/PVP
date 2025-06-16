using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Services
{
    public interface IPaymentGateway
    {

        Task<string> StartPaymentAsync(Invoice invoice, Payment payment);

        (string TransactionId, PaymentStatus Status, string RawPayload) ParseCallback(string payload);
    }
}