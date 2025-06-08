using WarShipsX.Application.Common.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbySingleton
{
    private readonly List<Guid> _connectedUserIds = [];

    public int GetConnectedUsersCount()
    {
        return _connectedUserIds.Count;
    }

    public void ConnectUser(string userId)
    {
        if (!Guid.TryParse(userId, out var parsedId))
        {
            throw new WsxException("Invalid user ID");
        }

        _connectedUserIds.Add(parsedId);
    }

    public void DisconnectUser(string userId)
    {
        if (!Guid.TryParse(userId, out var parsedId))
        {
            throw new WsxException("Invalid user ID");
        }

        _connectedUserIds.Remove(parsedId);
    }
}
