using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Hubs.Models.Entities;

namespace WarShipsX.Infrastructure.Persistence.Configuration.Game;

public class ShipConfiguration : IEntityTypeConfiguration<Ship>
{
    public void Configure(EntityTypeBuilder<Ship> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Game).WithMany(x => x.Ships);
    }
}
