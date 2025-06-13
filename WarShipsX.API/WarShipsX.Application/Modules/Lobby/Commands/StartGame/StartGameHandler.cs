using WarShipsX.Application.Modules.Game;
using WarShipsX.Application.Modules.Lobby.Models;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public class StartGameHandler(LobbyService lobby, GameService game) : ICommandHandler<StartGameCommand, GameDto?>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public async Task<GameDto?> ExecuteAsync(StartGameCommand command, CancellationToken ct)
    {
        await _lock.WaitAsync(ct);

        try
        {
            if (_lobby.GetConnectedPlayersCount() < 2)
            {
                return null;
            }

            var users = _lobby
                .GetPlayers()
                .Where(x => x.Id != command.Id)
                .ToList();

            if (users.Count == 0)
            {
                return null;
            }

            var opponent = users[Random.Shared.Next(0, users.Count)];

            _game.CreateNewGame(new(command.Id, command.Ships, []), opponent);

            return new(command.Id, opponent.Id);
        }
        finally
        {
            _lock.Release();
        }
    }
}
