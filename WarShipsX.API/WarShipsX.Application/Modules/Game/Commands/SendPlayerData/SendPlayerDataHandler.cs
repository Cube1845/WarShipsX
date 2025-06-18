using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

public class SendPlayerDataHandler(GameService gameService) : ICommandHandler<SendPlayerDataCommand, SendPlayerDataResponse?>
{
    private readonly GameService _game = gameService;
    private readonly Lock _lock = new();

    public Task<SendPlayerDataResponse?> ExecuteAsync(SendPlayerDataCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            var game = _game.GetGame(command.UserId);

            if (game == null)
            {
                return Task.FromResult<SendPlayerDataResponse?>(null);
            }

            var playerData = game.GetPlayerData(command.UserId);
            var opponentShips = game.GetOpponentData(command.UserId)?.Ships;

            if (playerData == null || opponentShips == null)
            {
                return Task.FromResult<SendPlayerDataResponse?>(null);
            }

            if (!playerData.InitiallyConnected)
            {
                playerData.RegisterFirstConnection();
            }

            playerData.UnsetDisconnectedDate();

            var executedShots = GetExecutedShots(opponentShips, playerData.ExecutedShots);
            return Task.FromResult<SendPlayerDataResponse?>(new(playerData.Ships, executedShots, IsPlayersTurn(game, playerData.Id)));
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
