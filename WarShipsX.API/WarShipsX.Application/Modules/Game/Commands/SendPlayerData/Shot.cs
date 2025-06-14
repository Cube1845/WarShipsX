using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

public class Shot(Position position, ShotState shotState)
{
    public Position Position { get; private init; } = position;
    public ShotState ShotState { get; set; } = shotState;
}
