namespace WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

public class UserDisconnectedHandler(GameService gameService, TimeProvider time) : ICommandHandler<UserDisconnectedCommand, UserDisconnectedResponse?>
{
    private readonly GameService _game = gameService;
    private readonly Lock _lock = new();
    private readonly TimeProvider _time = time;

    public Task<UserDisconnectedResponse?> ExecuteAsync(UserDisconnectedCommand command, CancellationToken ct)
    {
        lock (_lock)
        {
            var game = _game.GetGame(command.UserId);

            if (game == null)
            {
                return Task.FromResult<UserDisconnectedResponse?>(null);
            }

            var opponentData = game.GetOpponentData(command.UserId);
            var playerData = game.GetPlayerData(command.UserId);

            if (opponentData == null || playerData == null)
            {
                return Task.FromResult<UserDisconnectedResponse?>(null);
            }

            if (opponentData.DisconnectedDate == null)
            {
                playerData.SetDisconnectedDate(_time.GetUtcNow().LocalDateTime);
                return Task.FromResult<UserDisconnectedResponse?>(new(false, opponentData.Id));
            }

            _game.RemoveGame(command.UserId);

            return Task.FromResult<UserDisconnectedResponse?>(new(true, opponentData.Id));
        }
    }
}
