using System.Threading.Tasks;

namespace KomunalinisCentras.Backend.Services
{

    public interface IBillingService
    {

        Task<string> InitiatePaymentAsync(int invoiceId, decimal amount);
        
        Task HandleProviderCallbackAsync(string provider, string payload);
    }
}
