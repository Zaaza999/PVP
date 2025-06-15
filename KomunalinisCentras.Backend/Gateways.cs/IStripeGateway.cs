using System.Collections.Generic;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Dtos;

public interface IStripeGateway
{
    Task<(string Url, string SessionId)> CreateCheckoutSessionAsync(
        KomunalinisCentras.Backend.Entities.Invoice invoice, decimal amount);

    Task<(string Url, string SessionId)> CreateBatchCheckoutSessionAsync(
        IEnumerable<BatchPaymentItem> items, string currency);
}
