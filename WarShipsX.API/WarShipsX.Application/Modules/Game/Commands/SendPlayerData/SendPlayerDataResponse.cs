using WarShipsX.Application.Modules.Common.Models;

namespace WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

public record SendPlayerDataResponse(List<Ship> Ships, List<Shot> ExecutedShots);