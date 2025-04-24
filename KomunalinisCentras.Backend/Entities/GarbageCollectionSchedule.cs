using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    [Table("GarbageCollectionSchedule")]
    public class GarbageCollectionSchedule
    {
        [Key]
        [Column("schedule_id")]
        public int ScheduleId { get; set; }

        [Column("location_id")]
        public int LocationId { get; set; }

        [Column("waste_id")]
        public int WasteId { get; set; }

        [Column("collection_date")]
        public DateTime CollectionDate { get; set; }

        [Column("comment")]
        public string? Comment { get; set; }

        /* Navigacijos (nebūtina JSON’e) */
        [ForeignKey(nameof(LocationId))] 
        [JsonIgnore]
        public Location? Location { get; set; }

        [ForeignKey(nameof(WasteId))] 
        [JsonIgnore]
        public WasteType? WasteType { get; set; }
    }
}
