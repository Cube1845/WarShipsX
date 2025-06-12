using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Modules.Lobby.Models.Game.Game;

namespace WarShipsX.Infrastructure.Persistence.Configuration.Game;

public class ShotConfiguration : IEntityTypeConfiguration<Shot>
{
    public void Configure(EntityTypeBuilder<Shot> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Game).WithMany(x => x.Shots);
    }
}
