using WarShipsX.Application.Hubs.Lobby.Models;
using WarShipsX.Application.Hubs.Lobby.StartGame;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbyHub(LobbySingleton lobby) : AuthorizedHub
{
    private readonly LobbySingleton _lobby = lobby;

    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public async Task ConnectPlayer(List<List<PositionDto>> ships)
    {
        var userId = Guid.Parse(GetUserId());

        _lobby.ConnectPlayer(new(userId, ships));

        var startGameData = await new StartGameCommand(userId, ships).ExecuteAsync();

        if (startGameData != null)
        {
            await Clients.User(startGameData.Player1Id.ToString()).SendAsync("StartGame", startGameData.GameId);
            await Clients.User(startGameData.Player2Id.ToString()).SendAsync("StartGame", startGameData.GameId);
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.DisconnectPlayer(GetUserId());

        return base.OnDisconnectedAsync(exception);
    }
}
