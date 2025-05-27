// Services/IBillingService.cs
namespace KomunalinisCentras.Backend.Services
{
    public interface IBillingService
    {
        /// <summary>
        /// Inicijuoja Payment įrašą, kviečia gateway ir grąžina redirect URL.
        /// </summary>
        Task<string> InitiatePaymentAsync(int invoiceId, decimal amount);

        /// <summary>
        /// Apdoroja providerio callback užklausą.
        /// </summary>
        Task HandleProviderCallbackAsync(string provider, string payload);
    }
}