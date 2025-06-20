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

        game.ChangeTurn();

        return Task.FromResult<ShootResponse?>(new
        (
            GetShotState(command.ShotPosition, opponentData.Ships, playerData.ExecutedShots), false, opponentData.Id)
        );
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
