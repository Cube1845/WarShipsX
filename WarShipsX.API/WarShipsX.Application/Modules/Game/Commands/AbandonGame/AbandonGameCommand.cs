namespace WarShipsX.Application.Modules.Game.Commands.AbandonGame;

public record AbandonGameCommand(Guid UserId) : ICommand<AbandonGameResponse?>;