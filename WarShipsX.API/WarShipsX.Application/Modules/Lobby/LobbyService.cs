using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Lobby;

public class LobbyService
{
    private readonly List<PlayerDto> _queue = [];
    private readonly Lock _lock = new();

    public List<PlayerDto> GetPlayersInQueue()
    {
        lock (_lock)
        {
            return [.. _queue];
        }
    }

    public int GetPlayersInQueueCount()
    {
        lock (_lock)
        {
            return _queue.Count;
        }
    }

    public void AddPlayerToQueue(PlayerDto data)
    {
        lock (_lock)
        {
            _queue.Add(data);
        }
    }

    public void RemovePlayerFromQueue(Guid userId)
    {
        lock (_lock)
        {
            _queue.RemoveAll(x => x.Id == userId);
        }
    }
}
