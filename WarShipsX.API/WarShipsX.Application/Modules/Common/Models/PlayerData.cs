namespace WarShipsX.Application.Modules.Common.Models;

public class PlayerData(Guid id, List<Ship> ships, Action<Guid> onConnectionFn, Action<Guid> onDisconnectionFn)
{
    public Guid Id { get; private init; } = id;
    public List<Ship> Ships { get; private init; } = ships;
    public List<Position> ExecutedShots { get; private init; } = [];
    public bool Connected { get; private set; }
    private Action<Guid> OnConnectionFn { get; init; } = onConnectionFn;
    private Action<Guid> OnDisconnectionFn { get; init; } = onDisconnectionFn;

    public void RegisterConnection()
    {
        Connected = true;
        OnConnectionFn(Id);
    }

    public void RegisterDisconnection()
    {
        Connected = false;
        OnDisconnectionFn(Id);
    }
}