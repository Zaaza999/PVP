using System.Text.Json;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.DTOs
{
    public class StatusUpdateDto
    {
        public bool Approved { get; set; }
    }
}
