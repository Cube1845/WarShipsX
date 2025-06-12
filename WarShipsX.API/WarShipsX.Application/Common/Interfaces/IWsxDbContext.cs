using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Modules.Lobby.Models.Game;
using WarShipsX.Application.Modules.Lobby.Models.Game.Game;

namespace WarShipsX.Application.Common.Interfaces;

public interface IWsxDbContext
{
    Task<int> SaveChangesAsync(CancellationToken ct);
    DbSet<Game> Games { get; set; }
    DbSet<Ship> Ships { get; set; }
    DbSet<Position> Positions { get; set; }
    DbSet<Shot> Shots { get; set; }
}