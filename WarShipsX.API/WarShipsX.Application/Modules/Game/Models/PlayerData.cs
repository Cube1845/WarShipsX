namespace WarShipsX.Application.Modules.Game.Models;

public class PlayerData(Guid id, List<Ship> ships)
{
    public Guid Id { get; private init; } = id;
    public List<Ship> Ships { get; private init; } = ships;
    public List<Position> ExecutedShots { get; private init; } = [];
    public DateTime? DisconnectedDate { get; private set; } = null;

    public void SetDisconnectedDate(DateTime date)
    {
        DisconnectedDate = date;
    }

    public void ClearDisconnectedDate()
    {
        DisconnectedDate = null;
    }
}