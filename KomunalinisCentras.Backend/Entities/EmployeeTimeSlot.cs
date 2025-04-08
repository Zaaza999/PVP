namespace KomunalinisCentras.Backend.Entities
{
    public class EmployeeTimeSlot
    {
        public int TimeSlotId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime SlotDate { get; set; }
        public TimeSpan TimeFrom { get; set; }
        public TimeSpan TimeTo { get; set; }
        public int TopicId { get; set; }

        public User? Employee { get; set; }
        public VisitTopic? Topic { get; set; }
    }
}
