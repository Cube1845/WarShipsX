namespace WarShipsX.Application.Hubs.Lobby.Models;

public class PlayerData(Guid id, List<List<PositionDto>> ships)
{
    public Guid Id { get; set; } = id;
    public List<List<PositionDto>> Ships { get; set; } = ships;
}
