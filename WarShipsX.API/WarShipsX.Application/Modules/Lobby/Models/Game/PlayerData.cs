namespace WarShipsX.Application.Modules.Lobby.Models.Game;

public record PlayerData(Guid Id, List<Ship> Ships, List<Position> ExecutedShots) : PlayerDto(Id, Ships);