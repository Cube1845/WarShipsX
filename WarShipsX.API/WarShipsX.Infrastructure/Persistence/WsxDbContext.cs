using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Common.Interfaces;
using WarShipsX.Infrastructure.Auth.Entities;

namespace WarShipsX.Infrastructure.Persistence;

public class WsxDbContext(DbContextOptions<WsxDbContext> options) : DbContext(options), IWsxDbContext
{
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WsxDbContext).Assembly);
    }
}
