using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.AbandonGame;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;
using WarShipsX.Application.Modules.Game.Commands.Shoot;
using WarShipsX.Application.Modules.Game.Commands.UserConnected;
using WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub : AuthorizedHub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        var userId = GetUserId();

        var data = await new UserConnectedCommand(userId).ExecuteAsync();

        if (data == null)
        {
            Context.Abort();
            return;
        }

        await Clients.User(userId.ToString()).SendAsync("PlayerDataSent", data);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await new UserDisconnectedCommand(GetUserId()).ExecuteAsync();

        await base.OnDisconnectedAsync(exception);
    }

    public async Task AbandonGame()
    {
        AuthorizeUser();

        var data = await new AbandonGameCommand(GetUserId()).ExecuteAsync();

        if (data != null)
        {
            await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentAbandoned");
        }

        Context.Abort();
    }

    public async Task Shoot(Position position)
    {
        AuthorizeUser();

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
        await Clients.User(userId.ToString()).SendAsync("ShotFeedback", new Shot(position, data.ShotState));
    }
}
