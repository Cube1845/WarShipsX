using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

public record SendPlayerDataResponse(List<Ship> Ships, List<Shot> ExecutedShots, bool PlayersTurn);