using System.Security.Claims;
using WarShipsX.Application.Hubs.Lobby.Models;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

public class LobbyHub(LobbySingleton lobby) : AuthorizedHub
{
    private readonly LobbySingleton _lobby = lobby;

    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public Task ConnectPlayer(List<List<PositionDto>> ships)
    {
        _lobby.ConnectPlayer(new(Guid.Parse(GetUserId()), ships));

        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.DisconnectPlayer(GetUserId());

        return base.OnDisconnectedAsync(exception);
    }

    private string GetUserId()
    {
        return Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value!;
    }
}
