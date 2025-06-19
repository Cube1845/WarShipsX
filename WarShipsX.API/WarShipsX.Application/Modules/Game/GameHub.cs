using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;
using WarShipsX.Application.Modules.Game.Commands.Shoot;
using WarShipsX.Application.Modules.Game.Commands.UserConnected;
using WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub(ConnectionService reconnectionService) : AuthorizedHub
{
    private readonly ConnectionService _reconnectionService = reconnectionService;

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        var userId = GetUserId();

        var data = await new UserConnectedCommand(userId).ExecuteAsync();

        if (_reconnectionService._playerDisconnections.TryGetValue(userId, out var cts))
        {
            cts.Cancel();
        }

        if (data == null)
        {
            Context.Abort();
            return;
        }

        await Clients.User(userId.ToString()).SendAsync("PlayerDataSent", data);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);

        var userId = GetUserId();

        var data = await new UserDisconnectedCommand(userId).ExecuteAsync();

        if (data == null)
        {
            return;
        }

        if (!data.OpponentAlsoDisconnected)
        {
            await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentDisconnected");
        }

        await _reconnectionService.RegisterDisconnection(userId,
            async () =>
            {
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentConnected");
            },
            async () =>
            {
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentAbandoned");
            }
        );
    }

    public async Task Shoot(Position position)
    {
        var userId = GetUserId();

        var data = await new ShootCommand(userId, position).ExecuteAsync();

        if (data == null)
        {
            Context.Abort();
            return;
        }

        if (data.GameEnded)
        {
            //here implementation
        }

        await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentShot", position);
        await Clients.User(data.OpponentId.ToString()).SendAsync("ShotFeedback", data.ShotState);
    }
}
