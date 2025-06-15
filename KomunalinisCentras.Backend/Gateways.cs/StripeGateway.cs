// Gateways/StripeGateway.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Dtos;
using KomunalinisCentras.Backend.Entities;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using InvoiceEntity = KomunalinisCentras.Backend.Entities.Invoice;

namespace KomunalinisCentras.Backend.Gateways
{
    public class StripeGateway : IStripeGateway
    {
        private readonly StripeSettings _settings;

        public StripeGateway(IOptions<StripeSettings> opts)
        {
            _settings = opts.Value ?? throw new ArgumentNullException(nameof(opts));
            StripeConfiguration.ApiKey = _settings.SecretKey;
        }

        /* 1) Vienos sąskaitos sesija */
        public async Task<(string Url, string SessionId)> CreateCheckoutSessionAsync(
            InvoiceEntity invoice, decimal amount)
        {
            if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));

            var options = new SessionCreateOptions
            {
                Mode       = "payment",
                SuccessUrl = $"{_settings.FrontendUrl}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl  = $"{_settings.FrontendUrl}/payment-cancel?invoiceId={invoice.Id}",
                LineItems  = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency   = invoice.Currency,
                            UnitAmountDecimal = amount * 100,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Invoice #{invoice.Id}"
                            }
                        }
                    }
                }
            };

            var session = await new SessionService().CreateAsync(options);
            return (session.Url!, session.Id);
        }

        /* 2) Kelių sąskaitų (batch) sesija */
        public async Task<(string Url, string SessionId)> CreateBatchCheckoutSessionAsync(
            IEnumerable<BatchPaymentItem> items, string currency)
        {
            var lines = items.Select(it => new SessionLineItemOptions
            {
                Quantity = 1,
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency   = currency,
                    UnitAmountDecimal = it.Amount * 100,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = $"Invoice #{it.InvoiceId}"
                    }
                }
            }).ToList();

            var options = new SessionCreateOptions
            {
                Mode       = "payment",
                SuccessUrl = $"{_settings.FrontendUrl}/payment-success",
                CancelUrl  = $"{_settings.FrontendUrl}/payment-cancel",
                LineItems  = lines
            };

            var session = await new SessionService().CreateAsync(options);
            return (session.Url!, session.Id);
        }
    }

    /*────────────────── Konfigūracijos klasė ───────────────*/
    public class StripeSettings
    {
        public string SecretKey      { get; set; } = default!;
        public string PublishableKey { get; set; } = default!;
        public string WebhookSecret  { get; set; } = default!;
        public string FrontendUrl    { get; set; } = "http://localhost:3000";
    }
}
