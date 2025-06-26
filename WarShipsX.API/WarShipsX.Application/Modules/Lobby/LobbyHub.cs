using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Lobby.Commands.JoinQueue;
using WarShipsX.Application.Modules.Lobby.Commands.LeaveQueue;
using WarShipsX.Application.Modules.Lobby.Commands.UserConnected;

namespace WarShipsX.Application.Modules.Lobby;

[Authorize]
public class LobbyHub : AuthorizedHub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        var userId = GetUserId();

        var data = await new UserConnectedCommand(userId).ExecuteAsync();

        if (data.PlayerParticipates)
        {
            await Clients.User(userId.ToString()).SendAsync("PlayerParticipatesInGame");
            Context.Abort();

            return;
        }

        await Clients.User(userId.ToString()).SendAsync("PlayersCountChanged", data.PlayersInQueueCount);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var data = await new LeaveQueueCommand(GetUserId()).ExecuteAsync();

        await SendPlayersCount(data.PlayersInQueueCount);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinQueue(List<Ship> ships)
    {
        AuthorizeUser();

        var data = await new JoinQueueCommand(GetUserId(), ships).ExecuteAsync();

        if (data.Player1Id != null && data.Player2Id != null)
        {
            await Clients.User(data.Player1Id!.Value.ToString()).SendAsync("StartGame");
            await Clients.User(data.Player2Id!.Value.ToString()).SendAsync("StartGame");
        }

        await SendPlayersCount(data.NewPlayersInQueueCount);
    }

    public async Task LeaveQueue()
    {
        AuthorizeUser();

        var data = await new LeaveQueueCommand(GetUserId()).ExecuteAsync();

        await SendPlayersCount(data.PlayersInQueueCount);
    }

    private async Task SendPlayersCount(int playersCount)
    {
        await Clients.All.SendAsync("PlayersCountChanged", playersCount);
    }
}
