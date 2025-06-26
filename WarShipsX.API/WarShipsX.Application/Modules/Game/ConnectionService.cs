using System.Collections.Concurrent;
using WarShipsX.Application.Common.Services;

namespace WarShipsX.Application.Modules.Game;

public class ConnectionService(AwaitableTaskService taskService)
{
    private readonly AwaitableTaskService _taskService = taskService;

    public readonly ConcurrentDictionary<Guid, CancellationTokenSource> _playerDisconnections = new();

    private readonly TimeSpan _reconnectionTime = TimeSpan.FromSeconds(30);

    public void RegisterDisconnection(Guid playerId, Action playerConnectedFn, Action timePassedFn)
    {
        if (_playerDisconnections.TryRemove(playerId, out var oldCts))
        {
            oldCts.Cancel();
        }

        _playerDisconnections[playerId] = new();

        Action cleanUpFn = () => _playerDisconnections.TryRemove(playerId, out _);

        _ = _taskService
            .AwaitTask(_reconnectionTime, playerConnectedFn, timePassedFn, cleanUpFn, _playerDisconnections[playerId].Token);
    }
}
