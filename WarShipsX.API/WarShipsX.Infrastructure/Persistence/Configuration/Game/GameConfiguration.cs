using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WarShipsX.Infrastructure.Persistence.Configuration.Game;

public class GameConfiguration : IEntityTypeConfiguration<Application.Hubs.Models.Entities.Game.Game>
{
    public void Configure(EntityTypeBuilder<Application.Hubs.Models.Entities.Game.Game> builder)
    {
        builder.HasKey(x => x.Id);
    }
}
