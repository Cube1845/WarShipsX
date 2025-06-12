using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Common.Interfaces;
using WarShipsX.Application.Modules.Lobby.Models.Game;
using WarShipsX.Application.Modules.Lobby.Models.Game.Game;
using WarShipsX.Infrastructure.Auth.Entities;

namespace WarShipsX.Infrastructure.Persistence;

public class WsxDbContext(DbContextOptions<WsxDbContext> options) : DbContext(options), IWsxDbContext
{
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Game> Games { get; set; }
    public DbSet<Ship> Ships { get; set; }
    public DbSet<Position> Positions { get; set; }
    public DbSet<Shot> Shots { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WsxDbContext).Assembly);
    }
}
