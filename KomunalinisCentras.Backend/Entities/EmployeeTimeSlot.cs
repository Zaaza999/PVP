using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class EmployeeTimeSlot
    {
        [Key] 
        [Column("timeslot_id")]
        public int TimeSlotId { get; set; }   // <-- EF atpažins kaip PK

        [Column("employee_id")]
        public string EmployeeId { get; set; } 

        [Column("slot_date")]
        public DateTime SlotDate { get; set; } 

        [Column("time_from")]
        public TimeSpan TimeFrom { get; set; } 

        [Column("time_to")]
        public TimeSpan TimeTo { get; set; }  

        [Column("is_taken")]
        public bool IsTaken { get; set; }

        //[Column("topic_id")]
        //public int TopicId { get; set; }

        // Navigacinės savybės 
        [JsonIgnore]
        public User? Employee { get; set; }
        //public VisitTopic? Topic { get; set; }
    }
}
