namespace WarShipsX.Application.Modules.Game.Models;

public record Ship(List<Position> Positions)
{
    public static implicit operator Ship(List<Position> positions)
    {
        return new(positions);
    }
}
