using WarShipsX.Application.Modules.Lobby.Models.Game;

namespace WarShipsX.Application.Modules.Lobby.Models;

public record PlayerDto(Guid Id, List<Ship> Ships);