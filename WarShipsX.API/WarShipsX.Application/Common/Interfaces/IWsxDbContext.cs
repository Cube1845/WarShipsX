namespace WarShipsX.Application.Common.Interfaces;

public interface IWsxDbContext
{
    Task<int> SaveChangesAsync(CancellationToken ct);
}