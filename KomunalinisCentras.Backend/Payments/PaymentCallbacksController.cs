// Controllers/PaymentCallbacksController.cs
using KomunalinisCentras.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("payments/callback")]
    public class PaymentCallbacksController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public PaymentCallbacksController(IBillingService billingService)
            => _billingService = billingService;

        [HttpGet("paysera")]
        public async Task<IActionResult> Paysera()
        {
            var payload = Request.QueryString.Value?.TrimStart('?') ?? string.Empty;
            await _billingService.HandleProviderCallbackAsync("Paysera", payload);
            return Content("OK");
        }
    }
}