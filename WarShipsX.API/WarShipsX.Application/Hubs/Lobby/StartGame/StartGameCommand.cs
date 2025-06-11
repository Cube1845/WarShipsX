using WarShipsX.Application.Hubs.Lobby.Models;

namespace WarShipsX.Application.Hubs.Lobby.StartGame;

public record StartGameCommand(Guid Id, List<List<PositionDto>> Ships) : PlayerData(Id, Ships), ICommand<GameData?>;