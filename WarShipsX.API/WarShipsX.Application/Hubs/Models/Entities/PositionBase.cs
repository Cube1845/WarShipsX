namespace WarShipsX.Application.Hubs.Models.Entities;

public abstract class PositionBase : BaseEntity
{
    public Guid ShipId { get; set; }
    public int Number { get; set; }
    public string Letter { get; set; } = string.Empty;
}
