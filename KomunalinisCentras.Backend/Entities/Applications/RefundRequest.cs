using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Entities
{
    public class RefundRequest : Application
    {
        [Required]
        public string ApplicantFullName { get; set; } = null!;
        [Required]
        public string CorrespondenceAddress { get; set; } = null!;
        [Required]
        public string PayerCode  { get; set; } = null!;
        [Required]
        public string PaymentReason   { get; set; } = null!;
        [Required]
        public DateTime PaymentDate   { get; set; }
        [Required]
        public double PaymentAmount   { get; set; }
        [Required]
        public string TransactionNumber    { get; set; } = null!;
        [Required]
        public string RefundAccountNumber     { get; set; } = null!;
    }
}
