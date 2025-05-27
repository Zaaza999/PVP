// Services/IPaymentGateway.cs
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Services
{
    public interface IPaymentGateway
    {
        /// <summary>
        /// Inicijuoja mokėjimą pas providerį ir grąžina peradresavimo URL.
        /// </summary>
        Task<string> StartPaymentAsync(Invoice invoice, Payment payment);

        /// <summary>
        /// Iš providerio callback payload gražina tranzakcijos ID, statusą ir raw payload.
        /// </summary>
        (string TransactionId, PaymentStatus Status, string RawPayload) ParseCallback(string payload);
    }
}