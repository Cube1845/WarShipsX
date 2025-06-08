using WarShipsX.Application.Common.Interfaces;

namespace WarShipsX.Application.Hubs.Lobby.StartGame;

public class StartGameHandler(IWsxDbContext context, LobbySingleton lobby) : ICommandHandler<StartGameCommand, Guid>
{
    private readonly IWsxDbContext _context = context;
    private readonly LobbySingleton _lobby = lobby;

    public Task<Guid> ExecuteAsync(StartGameCommand command, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}
