namespace WarShipsX.Application.Modules.Game.Commands.AbandonGame;

public class AbandonGameHandler(GameService game) : ICommandHandler<AbandonGameCommand, AbandonGameResponse?>
{
    private readonly GameService _game = game;

    public Task<AbandonGameResponse?> ExecuteAsync(AbandonGameCommand command, CancellationToken ct)
    {
        var game = _game.GetGame(command.PlayerId);

        if (game == null)
        {
            return Task.FromResult<AbandonGameResponse?>(null);
        }

        var opponentId = game.GetOpponentData(command.PlayerId)!.Id;

        _game.RemoveGame(command.PlayerId);

        return Task.FromResult<AbandonGameResponse?>(new(opponentId));
    }
}