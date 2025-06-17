using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Lobby.Models;

public record PlayerDto(Guid Id, List<Ship> Ships);
