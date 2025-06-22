using WarShipsX.Application.Modules.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.UserConnected;

public class UserConnectedHandler(LobbyService lobby, GameService game) : ICommandHandler<UserConnectedCommand, UserConnectedResponse>
{
    private readonly LobbyService _lobby = lobby;
    private readonly GameService _game = game;

    public Task<UserConnectedResponse> ExecuteAsync(UserConnectedCommand command, CancellationToken ct)
    {
        var playersCount = _lobby.GetConnectedPlayersCount();
        var playerParticipates = _game.GetGame(command.PlayerId) != null;

        return Task.FromResult<UserConnectedResponse>(new(playerParticipates, playersCount));
    }
}