using WarShipsX.Application.Modules.Lobby.Models;
using WarShipsX.Application.Modules.Lobby.Models.Game;

namespace WarShipsX.Application.Modules.Lobby.Commands.StartGame;

public record StartGameCommand(Guid Id, List<Ship> Ships) : PlayerDto(Id, Ships), ICommand<GameDto?>;