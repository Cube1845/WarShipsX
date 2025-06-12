using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WarShipsX.Infrastructure.Persistence.Configuration.Game;

public class GameConfiguration : IEntityTypeConfiguration<Application.Modules.Lobby.Models.Game.Game.Game>
{
    public void Configure(EntityTypeBuilder<Application.Modules.Lobby.Models.Game.Game.Game> builder)
    {
        builder.HasKey(x => x.Id);
    }
}
