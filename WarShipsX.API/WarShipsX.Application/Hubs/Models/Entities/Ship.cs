namespace WarShipsX.Application.Hubs.Models.Entities;

public class Ship : BaseEntity
{
    public List<Position> Positions { get; set; } = [];
    public int GameId { get; set; }
    public Game.Game Game { get; set; } = default!;
    public Guid OwnerId { get; set; }
}
