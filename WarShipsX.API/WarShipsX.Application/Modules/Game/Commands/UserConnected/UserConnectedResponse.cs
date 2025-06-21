using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

namespace WarShipsX.Application.Modules.Game.Commands.UserConnected;

public record UserConnectedResponse(List<Ship> Ships, List<Shot> ExecutedShots, List<Position> OpponentShots, bool PlayersTurn, bool OpponentConnected);