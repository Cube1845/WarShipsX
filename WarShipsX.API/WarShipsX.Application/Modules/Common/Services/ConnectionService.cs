using System.Collections.Concurrent;

namespace WarShipsX.Application.Modules.Common.Services;

public class ConnectionService
{
    public readonly ConcurrentDictionary<Guid, CancellationTokenSource> _playerDisconnections = new();
    public readonly ConcurrentDictionary<Guid, CancellationTokenSource> _connectionAwaits = new();

    private readonly TimeSpan _reconnectionTime = TimeSpan.FromSeconds(30);

    public async Task RegisterConnectionAwait(Guid playerId, Action playersConnectedFn, Action timePassedFn)
    {
        if (_connectionAwaits.TryRemove(playerIds, out var oldCts))
        {
            oldCts.Cancel();
        }

        _connectionAwaits[playerId] = new();

        try
        {
            await Task.Delay(_reconnectionTime, _connectionAwaits[playerId].Token);

            timePassedFn();
        }
        catch (TaskCanceledException)
        {
            playerConnectedFn();
        }
        finally
        {
            _playerDisconnections.TryRemove(playerId, out _);
        }
    }

    public async Task RegisterDisconnection(Guid playerId, Action playerConnectedFn, Action timePassedFn)
    {
        if (_playerDisconnections.TryRemove(playerId, out var oldCts))
        {
            oldCts.Cancel();
        }

        _playerDisconnections[playerId] = new();

        try
        {
            await Task.Delay(_reconnectionTime, _playerDisconnections[playerId].Token);

            timePassedFn();
        }
        catch (TaskCanceledException)
        {
            playerConnectedFn();
        }
        finally
        {
            _playerDisconnections.TryRemove(playerId, out _);
        }
    }
}
