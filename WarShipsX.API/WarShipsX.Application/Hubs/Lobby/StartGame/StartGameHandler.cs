using WarShipsX.Application.Common.Interfaces;
using WarShipsX.Application.Hubs.Models.Entities.Game;

namespace WarShipsX.Application.Hubs.Lobby.StartGame;

public class StartGameHandler(IWsxDbContext context, LobbySingleton lobby) : ICommandHandler<StartGameCommand, Guid?>
{
    private readonly IWsxDbContext _context = context;
    private readonly LobbySingleton _lobby = lobby;

    public async Task<Guid?> ExecuteAsync(StartGameCommand command, CancellationToken ct)
    {
        List<Guid?> users = [.. _lobby.GetUserGuids().Where(x => x != command.UserId)];

        if (users.Count == 0)
        {
            return null;
        }


    }

    private async Task<Guid> CreateNewGame(Guid Player1Id, Guid Player2Id)
    {
        Game gameDb = new()
        {
            Player1Id = Player1Id,
            Player2Id = Player2Id,
            Turn = (Turn) Random.Shared.Next(1,3)
        };
    }
}
