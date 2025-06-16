using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Lobby;

public class LobbyService
{
    private readonly List<PlayerData> _connectedPlayers = [];
    private readonly Lock _lock = new();

    public List<PlayerData> GetPlayers()
    {
        lock (_lock)
        {
            return [.. _connectedPlayers];
        }
    }

    public int GetConnectedPlayersCount()
    {
        lock (_lock)
        {
            return _connectedPlayers.Count;
        }
    }

    public void AddPlayerToQueue(PlayerData data)
    {
        lock (_lock)
        {
            _connectedPlayers.Add(data);
        }
    }

    public void RemovePlayerFromQueue(Guid userId)
    {
        lock (_lock)
        {
            _connectedPlayers.RemoveAll(x => x.Id == userId);
        }
    }
}
