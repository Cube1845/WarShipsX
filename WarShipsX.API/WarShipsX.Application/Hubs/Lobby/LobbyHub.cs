using System.Security.Claims;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbyHub(LobbySingleton lobby) : AuthorizedHub
{
    private readonly LobbySingleton _lobby = lobby;

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        _lobby.ConnectUser(GetUserId());

        if (_lobby.GetConnectedUsersCount() >= 2)
        {

        }

        return;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.DisconnectUser(GetUserId());

        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.User(GetUserId()).SendAsync("ReceiveMessage", user, message);
    }

    private string GetUserId()
    {
        return Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value!;
    }
}
