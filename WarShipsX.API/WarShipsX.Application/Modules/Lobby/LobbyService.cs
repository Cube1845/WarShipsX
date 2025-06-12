using WarShipsX.Application.Modules.Lobby.Models.Game.Game;

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

    public void ConnectPlayer(PlayerData data)
    {
        lock (_lock)
        {
            _connectedPlayers.Add(data);
        }
    }

    public void DisconnectPlayer(string userId)
    {
        lock (_lock)
        {
            _connectedPlayers.RemoveAll(x => x.Id == Guid.Parse(userId));
        }
    }
}
