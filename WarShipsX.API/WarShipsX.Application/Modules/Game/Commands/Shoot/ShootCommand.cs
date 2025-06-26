using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Game.Commands.Shoot;

public record ShootCommand(Guid PlayerId, Position ShotPosition) : ICommand<ShootResponse?>;