namespace WarShipsX.Application.Modules.Lobby.Models.Game;

public record Ship(List<Position> Positions)
{
    public static implicit operator Ship(List<Position> positions)
    {
        return new(positions);
    }
}
