using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public record StartGameCommand(Guid Id, List<Ship> Ships) : ICommand<StartGameResponse?>;