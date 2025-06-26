using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.UserConnected;

public class UserConnectedHandler(GameService gameService) : ICommandHandler<UserConnectedCommand, UserConnectedResponse?>
{
    private readonly GameService _game = gameService;
    private readonly Lock _lock = new();

    public Task<UserConnectedResponse?> ExecuteAsync(UserConnectedCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            var game = _game.GetGame(command.UserId);

            if (game == null)
            {
                return Task.FromResult<UserConnectedResponse?>(null);
            }

            var playerData = game.GetPlayerData(command.UserId)!;
            var opponentData = game.GetOpponentData(command.UserId)!;

            var executedShots = GetExecutedShots(opponentData.Ships, playerData.ExecutedShots);

            playerData.RegisterConnection();

            return Task.FromResult<UserConnectedResponse?>
                (new(playerData.Ships, executedShots, opponentData.ExecutedShots, IsPlayersTurn(game, playerData.Id), opponentData.Connected));
        }
    }

    private List<Shot> GetExecutedShots(List<Ship> opponentShips, List<Position> playerShots)
    {
        var sunkenShipPositions = GetSunkenShipPositions(opponentShips, playerShots);

        return playerShots.Select(s =>
        {
            ShotState state = ShotState.Missed;

            if (sunkenShipPositions.Contains(s))
            {
                state = ShotState.Sunk;
            }
            else if (opponentShips.Any(x => x.Positions.Any(p => p == s)))
            {
                state = ShotState.Hit;
            }

            return new Shot(s, state);
        }).ToList();
    }

    private List<Position> GetSunkenShipPositions(List<Ship> opponentShips, List<Position> playerShots)
    {
        List<Position> sunkenShipPositions = [];

        foreach (var ship in opponentShips)
        {
            if (ship.Positions.All(playerShots.Contains))
            {
                sunkenShipPositions.AddRange(ship.Positions);
            }
        }

        return sunkenShipPositions;
    }

    private bool IsPlayersTurn(Models.Game game, Guid playerId)
    {
        if (game.Player1.Id == playerId)
        {
            return game.Turn == Turn.Player1;
        }

        return game.Turn == Turn.Player2;
    }
}
