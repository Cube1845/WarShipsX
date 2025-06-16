using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public class StartGameHandler(LobbyService lobby, GameService game, TimeProvider time) : ICommandHandler<StartGameCommand, StartGameResponse?>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;
    private readonly Lock _lock = new();
    private readonly TimeProvider _time = time;

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
            opponent.SetDisconnectedDate(_time.GetUtcNow().LocalDateTime);

            var player = new PlayerData(command.Id, command.Ships);
            player.SetDisconnectedDate(_time.GetUtcNow().LocalDateTime);

            _game.CreateNewGame(player, opponent);

            return Task.FromResult<StartGameResponse?>(new(command.Id, opponent.Id));
        }
    }
}
