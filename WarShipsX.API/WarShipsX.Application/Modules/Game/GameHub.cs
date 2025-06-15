using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub(GameService game, TimeProvider timeProvider) : AuthorizedHub
{
    private readonly GameService _game = game;
    private readonly TimeProvider _timeProvider = timeProvider;

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        var data = await new SendPlayerDataCommand(userId).ExecuteAsync();

        if (data != null)
        {
            await Clients.User(userId.ToString()).SendAsync("PlayerDataSent", data);
        }

        await base.OnConnectedAsync();

        return;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        _game.GetGame(userId)?.GetPlayerData(userId)?.SetDisconnectedDate(_timeProvider.GetUtcNow().LocalDateTime);

        return base.OnDisconnectedAsync(exception);
    }
}
