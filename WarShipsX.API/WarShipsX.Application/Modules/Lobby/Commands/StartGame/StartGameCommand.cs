using WarShipsX.Application.Modules.Game.Models;
using WarShipsX.Application.Modules.Lobby.Models;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public record StartGameCommand(Guid Id, List<Ship> Ships) : PlayerDto(Id, Ships), ICommand<GameDto?>;