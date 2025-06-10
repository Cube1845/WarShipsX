using WarShipsX.Application.Common.Interfaces;
using WarShipsX.Application.Hubs.Lobby.Models;
using WarShipsX.Application.Hubs.Models.Entities;
using WarShipsX.Application.Hubs.Models.Entities.Game;

namespace WarShipsX.Application.Hubs.Lobby.Handlers;

public class StartGameHandler(IWsxDbContext context, LobbySingleton lobby)
{
    private readonly IWsxDbContext _context = context;
    private readonly LobbySingleton _lobby = lobby;
    private static readonly SemaphoreSlim _gameLock = new(1, 1);

    public async Task<GameData?> ExecuteAsync(PlayerData playerData, CancellationToken ct = default)
    {
        await _gameLock.WaitAsync(ct);

        try
        {
            if (_lobby.GetConnectedPlayersCount() < 2)
                return null;

            var users = _lobby
                .GetPlayers()
                .Where(x => x.Id != playerData.Id)
                .ToList();

            if (users.Count == 0)
            {
                return null;
            }

            var opponent = users[Random.Shared.Next(0, users.Count)];

            return await CreateNewGame(playerData, opponent, ct);
        }
        finally
        {
            _gameLock.Release();
        }
    }

    private async Task<GameData> CreateNewGame(PlayerData player1, PlayerData player2, CancellationToken ct)
    {
        var gameDb = new Game
        {
            Player1Id = player1.Id,
            Player2Id = player2.Id,
            Turn = (Turn)Random.Shared.Next(1, 3)
        };

        await _context.Games.AddAsync(gameDb, ct);

        await AddPlayerShips(player1, gameDb.Id, ct);
        await AddPlayerShips(player2, gameDb.Id, ct);

        await _context.SaveChangesAsync(ct);

        return new(gameDb.Id, player1.Id, player2.Id);
    }

    private async Task AddPlayerShips(PlayerData playerData, Guid gameDbId, CancellationToken ct)
    {
        foreach (var ship in playerData.Ships)
        {
            Ship shipDb = new()
            {
                GameId = gameDbId,
                OwnerId = playerData.Id
            };

            await _context.Ships.AddAsync(shipDb, ct);

            var positionsDb = ship.Select(p => new Position
            {
                ShipId = shipDb.Id,
                Number = p.Number,
                Letter = p.Letter
            });

            foreach (var position in positionsDb)
            {
                await _context.Positions.AddAsync(position, ct);
            }
        }
    }
}
