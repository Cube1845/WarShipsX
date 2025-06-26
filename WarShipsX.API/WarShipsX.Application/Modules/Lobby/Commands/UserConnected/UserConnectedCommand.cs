namespace WarShipsX.Application.Modules.Lobby.Commands.UserConnected;

public record UserConnectedCommand(Guid PlayerId) : ICommand<UserConnectedResponse>;