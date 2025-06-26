namespace WarShipsX.Application.Modules.Lobby.Commands.UserConnected;

public record UserConnectedResponse(bool PlayerParticipates, int PlayersInQueueCount);