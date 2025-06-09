using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Hubs.Models.Entities;
using WarShipsX.Application.Hubs.Models.Entities.Game;

namespace WarShipsX.Application.Common.Interfaces;

public interface IWsxDbContext
{
    Task<int> SaveChangesAsync(CancellationToken ct);
    DbSet<Game> Games { get; set; }
    DbSet<Ship> Ships { get; set; }
    DbSet<Position> Positions { get; set; }
    DbSet<Shot> Shots { get; set; }
}