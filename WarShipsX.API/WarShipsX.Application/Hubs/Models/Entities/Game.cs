namespace WarShipsX.Application.Hubs.Models.Entities;

public class Game
{
    public Guid Id { get; set; }
    public Guid Player1Id { get; set; }
    public Guid Player2Id { get; set; }
    public Turn Turn { get; set; }
}
