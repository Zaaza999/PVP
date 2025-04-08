namespace KomunalinisCentras.Backend.Entities
{
    public class GarbageCollectionSchedule
    {
        public int ScheduleId { get; set; }
        public int LocationId { get; set; }
        public int WasteId { get; set; }
        public DateTime CollectionDate { get; set; }
        public string? Comment { get; set; }

        public Location? Location { get; set; }
        public WasteType? WasteType { get; set; }
    }
}
