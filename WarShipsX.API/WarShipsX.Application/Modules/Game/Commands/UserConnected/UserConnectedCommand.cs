namespace WarShipsX.Application.Modules.Game.Commands.UserConnected;

public record UserConnectedCommand(Guid UserId) : ICommand<UserConnectedResponse?>;