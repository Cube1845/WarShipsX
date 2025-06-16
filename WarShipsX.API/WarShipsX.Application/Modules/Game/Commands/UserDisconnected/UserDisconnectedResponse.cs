namespace WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

public record UserDisconnectedResponse(bool OpponentAlsoDisconnected, Guid OpponentId);