using System.Threading.Tasks;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game;

public class GameService(ConnectionService connectionService, IHubContext<GameHub> gameHubContext)
{
    private readonly ConnectionService _connectionService = connectionService;
    private readonly IHubContext<GameHub> _gameHubContext = gameHubContext;

    private readonly List<Models.Game> _games = [];
    private readonly Lock _lock = new();

    public async Task CreateNewGame(PlayerDto player1, PlayerDto player2)
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

        Action<Guid> onConnectionFn = (playerId) =>
        {
            if (_connectionService._playerDisconnections.TryRemove(playerId, out var cts))
            {
                cts.Cancel();
            }
        };

        Action<Guid> onDisconnectionFn = async (playerId) => await RegisterDisconnection(playerId);

        PlayerData playerData1 = new(player1.Id, player1.Ships, onConnectionFn, onDisconnectionFn);
        PlayerData playerData2 = new(player2.Id, player2.Ships, onConnectionFn, onDisconnectionFn);

        Models.Game game = new(playerData1, playerData2, (Turn)Random.Shared.Next(1, 3));

        _games.Add(game);

        await Task.WhenAll(RegisterDisconnection(player1.Id), RegisterDisconnection(player2.Id));
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

    private async Task RegisterDisconnection(Guid playerId)
    {
        var game = GetGame(playerId);

        if (game == null)
        {
            return;
        }

        var opponentData = game.GetOpponentData(playerId)!;

        if (opponentData.Connected)
        {
            await _gameHubContext.Clients.User(opponentData.Id.ToString()).SendAsync("WaitForOpponent");
        }

        Action timePassedFn = async () =>
        {
            _games.Remove(game);

            if (opponentData.Connected)
            {
                await _gameHubContext.Clients.User(opponentData.Id.ToString()).SendAsync("OpponentAbandoned");
            }
        };

        Action playerConnected = async () =>
        {
            if (opponentData.Connected)
            {
                await _gameHubContext.Clients.User(opponentData.Id.ToString()).SendAsync("OpponentConnected");
            }
        };

        _connectionService.RegisterDisconnection(playerId, playerConnected, timePassedFn);
    }
}
