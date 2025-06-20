namespace WarShipsX.Application.Modules.Game.Commands.AbandonGame;

public record AbandonGameCommand(Guid PlayerId) : ICommand<AbandonGameResponse?>;