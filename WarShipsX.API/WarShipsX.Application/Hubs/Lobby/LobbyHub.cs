using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbyHub : AuthorizedHub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.User(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value!).SendAsync("ReceiveMessage", user, message);
    }
}
