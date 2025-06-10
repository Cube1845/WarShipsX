namespace WarShipsX.Application.Hubs.Models.Entities;

public class Position : PositionBase
{
    public Guid ShipId { get; set; }
    public Ship Ship { get; set; } = default!;
}
