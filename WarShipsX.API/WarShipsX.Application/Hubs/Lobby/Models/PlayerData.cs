namespace WarShipsX.Application.Hubs.Lobby.Models;

public record PlayerData(Guid Id, List<List<PositionDto>> Ships);