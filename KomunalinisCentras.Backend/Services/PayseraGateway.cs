// Services/PayseraGateway.cs
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Entities;
using Microsoft.Extensions.Configuration;

namespace KomunalinisCentras.Backend.Services
{
    public class PayseraGateway : IPaymentGateway
    {
        private readonly IConfiguration _config;

        public PayseraGateway(IConfiguration config)
        {
            _config = config;
        }

        public Task<string> StartPaymentAsync(Invoice invoice, Payment payment)
        {
            var projectId    = _config["Paysera:ProjectId"]!;
            var signPassword = _config["Paysera:SignPassword"]!;
            var callbackUrl  = _config["Paysera:CallbackUrl"]!;

            // Suma centais
            var amount = ((int)(payment.Amount * 100)).ToString();
            // CRC eilutė
            var crc = string.Join(";", projectId, payment.Id, amount, invoice.Currency, callbackUrl);
            var sign = ComputeMd5(crc + signPassword);

            var qs = string.Join("&", new[] {
                $"projectid={projectId}",
                $"orderid={payment.Id}",
                $"amount={amount}",
                $"currency={invoice.Currency}",
                $"callbackurl={Uri.EscapeDataString(callbackUrl)}",
                "version=1.6",
                $"sign={sign}"
            });

            return Task.FromResult($"https://www.paysera.com/pay/?{qs}");
        }

        public (string TransactionId, PaymentStatus Status, string RawPayload) ParseCallback(string payload)
        {
            var dict = payload.Split('&')
                .Select(p => p.Split('='))
                .ToDictionary(a => a[0], a => Uri.UnescapeDataString(a[1]));

            var txnId  = dict["orderid"];
            var status = dict.TryGetValue("status", out var s) && s == "1"
                ? PaymentStatus.Succeeded
                : PaymentStatus.Failed;

            return (txnId, status, payload);
        }

        private static string ComputeMd5(string input)
        {
            using var md5 = MD5.Create();
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
        }
    }
}