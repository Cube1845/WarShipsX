namespace WarShipsX.Application.Modules.Lobby.Commands.LeaveQueue;

public record LeaveQueueCommand(Guid UserId) : ICommand<LeaveQueueResponse>;