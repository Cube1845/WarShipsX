using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.JoinQueue;

public class JoinQueueHandler(LobbyService lobby, GameService game) : ICommandHandler<JoinQueueCommand, JoinQueueResponse>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public async Task<JoinQueueResponse> ExecuteAsync(JoinQueueCommand command, CancellationToken ct)
    {
        await _lock.WaitAsync(ct);

        try
        {
            if (_lobby.GetPlayersInQueueCount() < 2)
            {
                _lobby.AddPlayerToQueue(new(command.Id, command.Ships));
                return new(null, null, _lobby.GetPlayersInQueueCount());
            }

            var users = _lobby
                .GetPlayersInQueue()
                .Where(x => x.Id != command.Id)
                .ToList();

            if (users.Count == 0)
            {
                _lobby.AddPlayerToQueue(new(command.Id, command.Ships));
                return new(null, null, _lobby.GetPlayersInQueueCount());
            }

            var opponent = users[Random.Shared.Next(0, users.Count)];

            await _game.CreateNewGame(new(command.Id, command.Ships), opponent);

            _lobby.RemovePlayerFromQueue(opponent.Id);
            _lobby.RemovePlayerFromQueue(command.Id);

            return new(command.Id, opponent.Id, _lobby.GetPlayersInQueueCount());
        }
        finally
        {
            _lock.Release();
        }
    }
}
