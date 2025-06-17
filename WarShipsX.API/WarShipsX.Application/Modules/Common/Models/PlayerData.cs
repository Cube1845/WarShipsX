namespace WarShipsX.Application.Modules.Common.Models;

public class PlayerData(Guid id, List<Ship> ships)
{
    public Guid Id { get; private init; } = id;
    public List<Ship> Ships { get; private init; } = ships;
    public List<Position> ExecutedShots { get; private init; } = [];
    public DateTime? DisconnectedDate { get; private set; } = null;
    public bool InitiallyConnected { get; private set; } = false;
    private Action OnInitialConnectionFn { get; set; } = () => {};

    public void SetDisconnectedDate(DateTime date)
    {
        DisconnectedDate = date;
    }

    public void UnsetDisconnectedDate()
    {
        DisconnectedDate = null;
    }

    public void SetOnInitialConnectionFn(Action fn)
    {
        OnInitialConnectionFn = fn;
    }

    public void RegisterFirstConnection()
    {
        InitiallyConnected = true;
        OnInitialConnectionFn();
    }
}