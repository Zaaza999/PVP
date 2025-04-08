namespace KomunalinisCentras.Backend.Entities
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int TimeSlotId { get; set; }
        public DateTime ReservationDate { get; set; }
        public string Status { get; set; } = "Confirmed";

        public User? User { get; set; }
        public EmployeeTimeSlot? TimeSlot { get; set; }
    }
}
