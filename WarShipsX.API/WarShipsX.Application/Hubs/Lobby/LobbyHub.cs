using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Hubs.Lobby.Models;
using WarShipsX.Application.Hubs.Lobby.StartGame;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

[Authorize]
public class LobbyHub(Lobby lobby) : AuthorizedHub
{
    private readonly Lobby _lobby = lobby;

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        await Clients.User(GetUserId()).SendAsync("PlayersCountChanged", _lobby.GetConnectedPlayersCount());

        return;
    }

    public async Task JoinLobby(List<List<PositionDto>> ships)
    {
        var userId = Guid.Parse(GetUserId());

        _lobby.ConnectPlayer(new(userId, ships));

        var startGameData = await new StartGameCommand(userId, ships).ExecuteAsync();

        if (startGameData != null)
        {
            await Clients.User(startGameData.Player1Id.ToString()).SendAsync("StartGame", startGameData.GameId);
            await Clients.User(startGameData.Player2Id.ToString()).SendAsync("StartGame", startGameData.GameId);
        }

        await SendPlayersCount();
    }

    public async Task LeaveLobby()
    {
        _lobby.DisconnectPlayer(GetUserId());
        await SendPlayersCount();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.DisconnectPlayer(GetUserId());
        await SendPlayersCount();

        await base.OnDisconnectedAsync(exception);

        return;
    }

    private async Task SendPlayersCount()
    {
        await Clients.All.SendAsync("PlayersCountChanged", _lobby.GetConnectedPlayersCount());
    }
}
