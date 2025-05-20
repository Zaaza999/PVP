using System.Text.Json;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.DTOs; // Assuming ApplicationDto is here

namespace KomunalinisCentras.Backend.Factory
{
    public static class ApplicationFactory
    {
        private static readonly JsonSerializerOptions jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public static Application? CreateFromDto(ApplicationDto dto)
        {
            var dataJson = dto.Data.GetRawText();

            Application? app = dto.FormType.ToLower() switch
            {
                "wastefeeexemption" => JsonSerializer.Deserialize<WasteFeeExemption>(dataJson, jsonOptions),
                "wastefeeexemptionbusiness" => JsonSerializer.Deserialize<WasteFeeExemptionBusiness>(dataJson, jsonOptions),
                "emailinvoicerequest" => JsonSerializer.Deserialize<EmailInvoiceRequest>(dataJson, jsonOptions),
                "propertyunsuitability" => JsonSerializer.Deserialize<PropertyUnsuitability>(dataJson, jsonOptions),
                "propertyusagedeclaration" => JsonSerializer.Deserialize<PropertyUsageDeclaration>(dataJson, jsonOptions),
                "residentcountdeclaration" => JsonSerializer.Deserialize<ResidentCountDeclaration>(dataJson, jsonOptions),
                "containerrequest" => JsonSerializer.Deserialize<ContainerRequest>(dataJson, jsonOptions),
                "containerfrequencychange" => JsonSerializer.Deserialize<ContainerFrequencyChange>(dataJson, jsonOptions),
                "containersizechangerequest" => JsonSerializer.Deserialize<ContainerSizeChangeRequest>(dataJson, jsonOptions),
                "payerdatachangerequest" => JsonSerializer.Deserialize<PayerDataChangeRequest>(dataJson, jsonOptions),
                "refundrequest" => JsonSerializer.Deserialize<RefundRequest>(dataJson, jsonOptions),
                // Add other types here
                _ => null
            };

            if (app == null) return null;

            var dataObj = JsonDocument.Parse(dataJson).RootElement;

            app.SubmittedByUserId = dataObj.GetProperty("submittedByUserId").GetString() ?? "";
            app.Date = dataObj.TryGetProperty("date", out var dateProp) && dateProp.ValueKind == JsonValueKind.String
                ? DateTime.Parse(dateProp.GetString()!)
                : DateTime.UtcNow;

            app.FormType = dto.FormType;

            app.StatusId = 2;

            app.ApplicationGroupId = GetApplicationGroupId(dto.FormType);

            return app;
        }

        public static Type? ResolveType(string formType)
        {
            return formType.ToLower() switch
            {
                "wastefeeexemption" => typeof(WasteFeeExemption),
                "wastefeeexemptionbusiness" => typeof(WasteFeeExemptionBusiness),
                "emailinvoicerequest" => typeof(EmailInvoiceRequest),
                "propertyunsuitability" => typeof(PropertyUnsuitability),
                "propertyusagedeclaration" => typeof(PropertyUsageDeclaration),
                "residentcountdeclaration" => typeof(ResidentCountDeclaration),
                "containerrequest" => typeof(ContainerRequest),
                "containerfrequencychange" => typeof(ContainerFrequencyChange),
                "containersizechangerequest" => typeof(ContainerSizeChangeRequest),
                "payerdatachangerequest" => typeof(PayerDataChangeRequest),
                "refundrequest" => typeof(RefundRequest),
                _ => null
            };
        }

        private static int GetApplicationGroupId(string formType)
        {
            formType = formType.Trim().ToLower(); // Normalize

            return formType switch
            {
                // Billing & Finance - GroupId = 1
                "wastefeeexemption" => 1,
                "wastefeeexemptionbusiness" => 1,
                "emailinvoicerequest" => 1,
                "refundrequest" => 1,

                // Property & Residency - GroupId = 2
                "propertyunsuitability" => 2,
                "propertyusagedeclaration" => 2,
                "residentcountdeclaration" => 2,

                // Container Management - GroupId = 3
                "containerrequest" => 3,
                "containerfrequencychange" => 3,
                "containersizechangerequest" => 3,

                // Personal Data / Account Updates - GroupId = 4
                "payerdatachangerequest" => 4,

                _ => 5 // Not recognized
            };
        }
    }

}
