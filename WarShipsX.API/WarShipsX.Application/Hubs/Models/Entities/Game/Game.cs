namespace WarShipsX.Application.Hubs.Models.Entities.Game;

public class Game : BaseEntity
{
    public Guid Player1Id { get; set; }
    public Guid Player2Id { get; set; }
    public Turn Turn { get; set; }
    public List<Ship> Ships { get; set; } = [];
    public List<Shot> Shots { get; set; } = [];
}
