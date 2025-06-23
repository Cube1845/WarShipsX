using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.Shoot;

public record ShootResponse(ShotState ShotState, Guid OpponentId, GameState GameState, List<Ship>? WinnerShips, Guid? WinnerId);