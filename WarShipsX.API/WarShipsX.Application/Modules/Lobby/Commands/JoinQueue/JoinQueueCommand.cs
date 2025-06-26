using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Lobby.Commands.JoinQueue;

public record JoinQueueCommand(Guid Id, List<Ship> Ships) : ICommand<JoinQueueResponse>;