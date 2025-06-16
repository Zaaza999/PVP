using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Dtos;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Gateways;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Controllers;

[ApiController]
[Route("payments")]
public class PaymentsBatchController : ControllerBase
{
    private readonly KomunalinisDbContext _db;
    private readonly IStripeGateway _stripe;

    public PaymentsBatchController(KomunalinisCentras.Backend.Data.KomunalinisDbContext db,
                                   IStripeGateway stripe)
    {
        _db = db;
        _stripe = stripe;
    }

    [HttpPost("batch")]
    public async Task<IActionResult> PayMany([FromBody] BatchPaymentDto dto)
    {
        if (dto?.Items is null || dto.Items.Count == 0)
            return BadRequest("items required");

        var ids = dto.Items.Select(i => i.InvoiceId).ToList();
        var invoices = await _db.Invoices
            .Include(i => i.Payments)
            .Where(i => ids.Contains(i.Id))
            .ToListAsync();

        foreach (var it in dto.Items)
        {
            var inv = invoices.FirstOrDefault(i => i.Id == it.InvoiceId);
            if (inv == null) return NotFound($"invoice {it.InvoiceId}");
            var paid = inv.Payments.Where(p => p.Status == PaymentStatus.Succeeded)
                                   .Sum(p => p.Amount);
            var remaining = inv.Amount - paid;
            if (it.Amount <= 0 || it.Amount > remaining)
                return BadRequest($"invoice {inv.Id}: 0 < amount ≤ {remaining}");
        }

        var currency = invoices.First().Currency;
        if (invoices.Any(i => i.Currency != currency))
            return BadRequest("All invoices must have same currency");

        (string url, string sessionId) =
            await _stripe.CreateBatchCheckoutSessionAsync(dto.Items, currency);

        var now = DateTime.UtcNow;
        foreach (var it in dto.Items)
        {
            var uniqueTxnId = $"{sessionId}-{it.InvoiceId}";
            _db.Payments.Add(new Payment
            {
                InvoiceId = it.InvoiceId,
                Amount = it.Amount,
                Currency = currency,
                Provider = "Stripe",
                ProviderTxnId = uniqueTxnId,
                Status = PaymentStatus.Initiated,
                CreatedAt = now,
                UpdatedAt = now
            });
        }
        await _db.SaveChangesAsync();

        return Ok(new { redirectUrl = url });
    } 
    [HttpGet("by-session/{sessionId}")]
    public async Task<IActionResult> BySession(string sessionId)
    {
        var list = await _db.Payments
            .Where(p => p.Provider == "Stripe" &&
                        p.ProviderTxnId.StartsWith(sessionId))
            .Select(p => new
            {
                p.InvoiceId,
                p.Amount,
                p.Currency,
                p.Status
            })
            .ToListAsync();

        return Ok(list);
    }
}
