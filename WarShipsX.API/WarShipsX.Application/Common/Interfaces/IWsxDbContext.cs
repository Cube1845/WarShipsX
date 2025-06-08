using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Hubs.Models.Entities;

namespace WarShipsX.Application.Common.Interfaces;

public interface IWsxDbContext
{
    Task<int> SaveChangesAsync(CancellationToken ct);
    DbSet<Game> Games { get; set; }
}