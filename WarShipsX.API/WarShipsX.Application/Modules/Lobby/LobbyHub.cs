using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Game.Models;
using WarShipsX.Application.Modules.Lobby.Commands.StartGame;

namespace WarShipsX.Application.Modules.Lobby;

[Authorize]
public class LobbyHub(LobbyService lobby) : AuthorizedHub
{
    private readonly LobbyService _lobby = lobby;

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        await Clients.User(GetUserId().ToString()).SendAsync("PlayersCountChanged", _lobby.GetConnectedPlayersCount());

        return;
    }

    public async Task JoinLobby(List<Ship> ships)
    {
        var userId = GetUserId();

        _lobby.AddPlayerToQueue(new(userId, ships));

        var startGameData = await new StartGameCommand(userId, ships).ExecuteAsync();

        if (startGameData != null)
        {
            await Clients.User(startGameData.Player1Id.ToString()).SendAsync("StartGame");
            await Clients.User(startGameData.Player2Id.ToString()).SendAsync("StartGame");
        }

        await SendPlayersCount();
    }

    public async Task LeaveLobby()
    {
        _lobby.RemovePlayerFromQueue(GetUserId());
        await SendPlayersCount();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.RemovePlayerFromQueue(GetUserId());
        await SendPlayersCount();

        await base.OnDisconnectedAsync(exception);

        return;
    }

    private async Task SendPlayersCount()
    {
        await Clients.All.SendAsync("PlayersCountChanged", _lobby.GetConnectedPlayersCount());
    }
}
