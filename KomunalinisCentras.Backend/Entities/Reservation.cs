using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class Reservation
    { 
        [Key]
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int TimeSlotId { get; set; }
        public DateTime ReservationDate { get; set; }
        public string Status { get; set; } = "Confirmed"; 
        public int TopicId { get; set; }

        public User? User { get; set; }
        public EmployeeTimeSlot? TimeSlot { get; set; } 
        public VisitTopic? Topic { get; set; }
    }
}
