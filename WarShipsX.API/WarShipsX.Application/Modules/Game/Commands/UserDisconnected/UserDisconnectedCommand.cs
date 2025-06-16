namespace WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

public record UserDisconnectedCommand(Guid UserId) : ICommand<UserDisconnectedResponse?>;