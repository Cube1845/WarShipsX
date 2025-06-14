using WarShipsX.Application.Modules.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public class StartGameHandler(LobbyService lobby, GameService game) : ICommandHandler<StartGameCommand, StartGameResponse?>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private readonly Lock _lock = new();

    public Task<StartGameResponse?> ExecuteAsync(StartGameCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            if (_lobby.GetConnectedPlayersCount() < 2)
            {
                return Task.FromResult<StartGameResponse?>(null);
            }

            var users = _lobby
                .GetPlayers()
                .Where(x => x.Id != command.Id)
                .ToList();

            if (users.Count == 0)
            {
                return Task.FromResult<StartGameResponse?>(null);
            }

            var opponent = users[Random.Shared.Next(0, users.Count)];

            _game.CreateNewGame(new(command.Id, command.Ships), opponent);

            return Task.FromResult<StartGameResponse?>(new(command.Id, opponent.Id));
        }
    }
}
