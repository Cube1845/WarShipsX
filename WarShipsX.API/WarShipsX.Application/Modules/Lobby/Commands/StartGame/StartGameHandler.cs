using WarShipsX.Application.Modules.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public class StartGameHandler(LobbyService lobby, GameService game) : ICommandHandler<StartGameCommand, StartGameResponse?>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public async Task<StartGameResponse?> ExecuteAsync(StartGameCommand command, CancellationToken ct)
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

            await _game.CreateNewGame(new(command.Id, command.Ships), opponent);

            _lobby.RemovePlayerFromQueue(opponent.Id);
            _lobby.RemovePlayerFromQueue(command.Id);

            return new(command.Id, opponent.Id);
        }
        finally
        {
            _lock.Release();
        }
    }
}
