using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.Shoot;

public record ShootResponse(ShotState ShotState, bool GameEnded, Guid OpponentId);