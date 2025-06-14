using WarShipsX.Application.Modules.Game;
using WarShipsX.Application.Modules.Lobby.Models;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public class StartGameHandler(LobbyService lobby, GameService game) : ICommandHandler<StartGameCommand, GameDto?>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private readonly Lock _lock = new();

    public Task<GameDto?> ExecuteAsync(StartGameCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            if (_lobby.GetConnectedPlayersCount() < 2)
            {
                return Task.FromResult<GameDto?>(null);
            }

            var users = _lobby
                .GetPlayers()
                .Where(x => x.Id != command.Id)
                .ToList();

            if (users.Count == 0)
            {
                return Task.FromResult<GameDto?>(null);
            }

            var opponent = users[Random.Shared.Next(0, users.Count)];

            _game.CreateNewGame(new(command.Id, command.Ships), opponent);

            return Task.FromResult<GameDto?>(new(command.Id, opponent.Id));
        }
    }
}
