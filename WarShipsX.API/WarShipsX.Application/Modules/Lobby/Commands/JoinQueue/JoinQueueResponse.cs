namespace WarShipsX.Application.Modules.Lobby.Commands.JoinQueue;

public record JoinQueueResponse(Guid? Player1Id, Guid? Player2Id, int NewPlayersInQueueCount);
