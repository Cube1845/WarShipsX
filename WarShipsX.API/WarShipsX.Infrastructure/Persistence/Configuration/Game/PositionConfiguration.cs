using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Hubs.Models.Entities;

namespace WarShipsX.Infrastructure.Persistence.Configuration.Game;

public class PositionConfiguration : IEntityTypeConfiguration<Position>
{
    public void Configure(EntityTypeBuilder<Position> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Ship).WithMany(x => x.Positions);
    }
}