using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("payments/callback")]
    public class PaymentCallbacksController : ControllerBase
    {
        private readonly KomunalinisDbContext _db;
        private readonly IConfiguration _cfg;
        private readonly ILogger<PaymentCallbacksController> _logger;

        public PaymentCallbacksController(KomunalinisDbContext db,
                                          IConfiguration cfg,
                                          ILogger<PaymentCallbacksController> logger)
        {
            _db     = db;
            _cfg    = cfg;
            _logger = logger;
        }

        [HttpPost("stripe")]
        public async Task<IActionResult> Stripe()
        {
            var json      = await new StreamReader(Request.Body).ReadToEndAsync();
            var signature = Request.Headers["Stripe-Signature"];
            var secret    = _cfg["Stripe:WebhookSecret"];

            Event evt;
            try
            {
                evt = EventUtility.ConstructEvent(json, signature, secret);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stripe signature mismatch");
                return BadRequest();
            }

            if (evt.Type == "checkout.session.completed")
            {
                var session = (Session)evt.Data.Object;
                if (session.Metadata.TryGetValue("invoice_id", out var invIdStr) &&
                    int.TryParse(invIdStr, out var invId))
                {
                    var invoice = await _db.Invoices.Include(i => i.Payments)
                                                    .FirstOrDefaultAsync(i => i.Id == invId);
                    if (invoice != null)
                    {
                        var payment = invoice.Payments
                                             .FirstOrDefault(p => p.Provider == "Stripe" &&
                                                                  p.ProviderTxnId == session.Id);
                        if (payment != null)
                        {
                            payment.Status    = PaymentStatus.Succeeded;
                            payment.UpdatedAt = DateTime.UtcNow;
                        }

                        var totalPaid = invoice.Payments
                                               .Where(p => p.Status == PaymentStatus.Succeeded)
                                               .Sum(p => p.Amount);
                        if (totalPaid >= invoice.Amount)
                        {
                            invoice.Status = InvoiceStatus.Paid;
                            invoice.PaidAt = DateTime.UtcNow;
                        }
                        else
                        {
                            invoice.Status = InvoiceStatus.Pending;
                        }

                        await _db.SaveChangesAsync();
                    }
                }
            }

            return Ok();
        }

        [HttpGet("paysera")]
        public IActionResult Paysera() => Ok("Paysera callback nebeaktualus (dabar naudojame Stripe).");
    }
}
