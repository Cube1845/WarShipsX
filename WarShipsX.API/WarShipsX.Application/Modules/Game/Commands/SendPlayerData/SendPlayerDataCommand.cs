namespace WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

public record SendPlayerDataCommand(Guid UserId) : ICommand<SendPlayerDataResponse?>;