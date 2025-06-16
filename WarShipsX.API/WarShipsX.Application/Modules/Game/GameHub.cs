using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Services;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;
using WarShipsX.Application.Modules.Game.Commands.UserDisconnected;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub(GameService game, ConnectionService reconnectionService) : AuthorizedHub
{
    private readonly GameService _game = game;
    private readonly ConnectionService _reconnectionService = reconnectionService;

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        var userId = GetUserId();

        var data = await new SendPlayerDataCommand(userId).ExecuteAsync();

        if (data == null)
        {
            Context.Abort();
            return;
        }

        await Clients.User(userId.ToString()).SendAsync("PlayerDataSent", data);

        if (_reconnectionService._playerDisconnections.TryGetValue(userId, out var cts))
        {
            cts.Cancel();
        }

        var opponentData = _game.GetGame(userId)!.GetOpponentData(userId)!;
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
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentReconnected");
            },
            async () =>
            {
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentAbandoned");
            }
        );
    }
}
