using System.Text.Json;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.DTOs
{
    public class ApplicationDto
    {
        public string FormType { get; set; } = null!;
        public JsonElement Data { get; set; } // Raw JSON to deserialize later
    }


}
