namespace WarShipsX.Application.Modules.Lobby.Commands.LeaveQueue;

public class LeaveQueueHandler(LobbyService lobby) : ICommandHandler<LeaveQueueCommand, LeaveQueueResponse>
{
    private readonly LobbyService _lobby = lobby;

    public Task<LeaveQueueResponse> ExecuteAsync(LeaveQueueCommand command, CancellationToken ct)
    {
        _lobby.RemovePlayerFromQueue(command.UserId);
        var playersInQueue = _lobby.GetPlayersInQueueCount();

        return Task.FromResult<LeaveQueueResponse>(new(playersInQueue));
    }
}