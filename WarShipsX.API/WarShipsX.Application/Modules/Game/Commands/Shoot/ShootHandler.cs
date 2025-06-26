using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.Shoot;

public class ShootHandler(GameService game) : ICommandHandler<ShootCommand, ShootResponse?>
{
    private readonly GameService _game = game;

    public Task<ShootResponse?> ExecuteAsync(ShootCommand command, CancellationToken ct)
    {
        var game = _game.GetGame(command.PlayerId);

        if (game == null)
        {
            return Task.FromResult<ShootResponse?>(null);
        }

        var playerData = game.GetPlayerData(command.PlayerId);
        var opponentData = game.GetOpponentData(command.PlayerId);

        if (playerData == null || opponentData == null || !IsPlayersTurn(game, command.PlayerId))
        {
            return Task.FromResult<ShootResponse?>(null);
        }

        playerData.ExecutedShots.Add(command.ShotPosition);

        var gameState = GetGameState(game, out var winnerId);

        if (gameState == GameState.Ongoing)
        {
            game.ChangeTurn();
        }
        else
        {
            _game.RemoveGame(command.PlayerId);
        }

        return Task.FromResult<ShootResponse?>(new
        (
            GetShotState(command.ShotPosition, opponentData.Ships, playerData.ExecutedShots),
            opponentData.Id,
            gameState,
            winnerId == null ? null : game.GetPlayerData(winnerId!.Value)!.Ships,
            winnerId
        ));
    }

    private GameState GetGameState(Models.Game game, out Guid? winnerId)
    {
        winnerId = null;

        var player1RemainingShipsToSink = GetRemainingShipPositionsCount(game.Player2.Ships, game.Player1.ExecutedShots);
        var player2RemainingShipsToSink = GetRemainingShipPositionsCount(game.Player1.Ships, game.Player2.ExecutedShots);

        if (player1RemainingShipsToSink == 0)
        {
            if (game.InitialTurn == Turn.Player2)
            {
                winnerId = game.Player1.Id;
                return GameState.Won;
            }

            if (player2RemainingShipsToSink > 1)
            {
                winnerId = game.Player1.Id;
                return GameState.Won;
            }

            if (player2RemainingShipsToSink == 0)
            {
                return GameState.Tied;
            }
        }

        if (player2RemainingShipsToSink == 0)
        {
            if (game.InitialTurn == Turn.Player1)
            {
                winnerId = game.Player2.Id;
                return GameState.Won;
            }

            if (player1RemainingShipsToSink > 1)
            {
                winnerId = game.Player2.Id;
                return GameState.Won;
            }

            if (player1RemainingShipsToSink == 0)
            {
                return GameState.Tied;
            }
        }

        return GameState.Ongoing;
    }

    private int GetRemainingShipPositionsCount(List<Ship> ships, List<Position> shots)
    {
        var flattenedShips = ships
            .Select(s => s.Positions)
            .SelectMany(s => s)
            .ToList();

        var reducedShips = flattenedShips
            .Where(s => !shots.Contains(s))
            .ToList();

        return reducedShips.Count;
    }

    private bool IsPlayersTurn(Models.Game game, Guid playerId)
    {
        if (game.Turn == Turn.Player1)
        {
            return game.Player1.Id == playerId;
        }

        return game.Player2.Id == playerId;
    }

    private ShotState GetShotState(Position shot, List<Ship> opponentShips, List<Position> executedPlayerShots)
    {
        if (!opponentShips.Any(s => s.Positions.Contains(shot)))
        {
            return ShotState.Missed;
        }

        var hitShip = opponentShips.First(s => s.Positions.Contains(shot));

        var reducedHitShip = hitShip.Positions
            .Where(s => !executedPlayerShots.Contains(s) && shot != s)
            .ToList();

        return reducedHitShip.Count == 0
            ? ShotState.Sunk
            : ShotState.Hit;
    }
}
