namespace WarShipsX.Application.Hubs.Lobby.StartGame;

public class StartGameCommand : ICommand<Guid>
{
    public Guid UserId { get; set; }
}
