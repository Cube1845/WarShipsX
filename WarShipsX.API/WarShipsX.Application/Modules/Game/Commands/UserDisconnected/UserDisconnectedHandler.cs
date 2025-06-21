namespace WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

public class UserDisconnectedHandler(GameService gameService) : ICommandHandler<UserDisconnectedCommand>
{
    private readonly GameService _game = gameService;
    private readonly Lock _lock = new();

    public Task ExecuteAsync(UserDisconnectedCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            var game = _game.GetGame(command.UserId);

            if (game == null)
            {
                return Task.CompletedTask;
            }

            game.GetPlayerData(command.UserId)!.RegisterDisconnection();

            return Task.CompletedTask;
        }
    }
}
