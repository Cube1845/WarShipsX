namespace WarShipsX.Application.Hubs.Models.Entities;

public class Position : PositionBase
{
    public Ship Ship { get; set; } = default!;
}
