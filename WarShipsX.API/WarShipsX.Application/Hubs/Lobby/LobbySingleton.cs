using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Hubs.Lobby.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbySingleton
{
    private readonly List<PlayerData> _connectedPlayers = [];

    public List<PlayerData> GetPlayers()
    {
        return _connectedPlayers;
    }

    public int GetConnectedPlayersCount()
    {
        return _connectedPlayers.Count;
    }

    public void ConnectPlayer(PlayerData data)
    {
        _connectedPlayers.Add(data);
    }

    public void DisconnectPlayer(string userId)
    {
        _connectedPlayers.RemoveAll(x => x.Id == Guid.Parse(userId));
    }
}
