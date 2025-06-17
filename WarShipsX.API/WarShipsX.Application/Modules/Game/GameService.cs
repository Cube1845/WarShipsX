using Microsoft.AspNetCore.SignalR;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Common.Services;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game;

public class GameService(AwaitableTaskService taskService, IHubContext<GameHub> gameHubContext)
{
    private readonly AwaitableTaskService _taskService = taskService;
    private readonly IHubContext<GameHub> _gameHubContext = gameHubContext;

    private readonly List<Models.Game> _games = [];
    private readonly Lock _lock = new();

    private readonly TimeSpan _connectionTime = TimeSpan.FromSeconds(30);

    public void CreateNewGame(PlayerData player1, PlayerData player2)
    {
        if (_games.Any(g =>
            g.Player1.Id == player1.Id ||
            g.Player1.Id == player2.Id ||
            g.Player2.Id == player1.Id ||
            g.Player2.Id == player2.Id
        ))
        {
            throw new WsxException("One of the players is already in game");
        }

        Models.Game game = new(player1, player2, (Turn)Random.Shared.Next(1, 3));

        _games.Add(game);

        WaitForPlayerConnections(game);
    }

    public void RemoveGame(Guid participantId)
    {
        lock (_lock)
        {
            _games.RemoveAll(g => g.Player1.Id == participantId || g.Player2.Id == participantId);
        }
    }

    public Models.Game? GetGame(Guid participantId)
    {
        lock (_lock)
        {
            return _games.FirstOrDefault(g => g.Player1.Id == participantId || g.Player2.Id == participantId);
        }
    }

    private void WaitForPlayerConnections(Models.Game game)
    {
        CancellationTokenSource cts = new();

        game.Player1.SetOnInitialConnectionFn(() =>
        {
            if (game.Player2.InitiallyConnected)
            {
                cts.Cancel();
            }
        });

        game.Player2.SetOnInitialConnectionFn(() =>
        {
            if (game.Player1.InitiallyConnected)
            {
                cts.Cancel();
            }
        });

        Action timePassedFn = async () =>
        {
            _games.Remove(game);

            if (game.Player1.InitiallyConnected)
            {
                await _gameHubContext.Clients.User(game.Player1.Id.ToString()).SendAsync("OpponentAbandoned");
            }

            if (game.Player2.InitiallyConnected)
            {
                await _gameHubContext.Clients.User(game.Player2.Id.ToString()).SendAsync("OpponentAbandoned");
            }
        };

        Action bothPlayersConnectedFn = async () =>
        {
            await _gameHubContext.Clients.User(game.Player1.Id.ToString()).SendAsync("OpponentConnected");
            await _gameHubContext.Clients.User(game.Player2.Id.ToString()).SendAsync("OpponentConnected");
        };

        _ = _taskService.AwaitTask(_connectionTime, bothPlayersConnectedFn, timePassedFn, () => {}, cts.Token);
    }
}
