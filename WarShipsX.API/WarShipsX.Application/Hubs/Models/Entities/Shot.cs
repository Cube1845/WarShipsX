namespace WarShipsX.Application.Hubs.Models.Entities;

public class Shot : PositionBase
{
    public Guid GameId { get; set; }
    public Game.Game Game { get; set; } = default!;
    public Guid ShooterId { get; set; }
}
