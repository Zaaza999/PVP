using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class Reservation
    { 
        [Key]
        public int ReservationId { get; set; }
        
        [Column("user_id")]
        public string UserId { get; set; }
        
        [Column("timeslot_id")]
        public int TimeSlotId { get; set; }
        
        [Column("reservation_date")]
        public DateTime ReservationDate { get; set; }
        
        [Column("status")]
        public string Status { get; set; } = "Confirmed"; 
        
        [Column("topic_id")]
        public int TopicId { get; set; } 
        
        public User? User { get; set; } 

        [JsonIgnore]
        public EmployeeTimeSlot? TimeSlot { get; set; } 

        [JsonIgnore]
        public VisitTopic? Topic { get; set; }
    }
}
