using WarShipsX.Application.Hubs.Lobby.Models;

namespace WarShipsX.Application.Hubs.Lobby.StartGame;

public class StartGameCommand(Guid id, List<List<PositionDto>> ships) : PlayerData(id, ships), ICommand<Guid?>;