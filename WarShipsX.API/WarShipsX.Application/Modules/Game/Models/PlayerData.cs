using WarShipsX.Application.Modules.Lobby.Models;

namespace WarShipsX.Application.Modules.Game.Models;

public record PlayerData(Guid Id, List<Ship> Ships, List<Position> ExecutedShots) : PlayerDto(Id, Ships);