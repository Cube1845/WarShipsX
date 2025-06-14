using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub(GameService game, TimeProvider timeProvider) : AuthorizedHub
{
    private readonly GameService _game = game;
    private readonly TimeProvider _timeProvider = timeProvider;

    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        _game.GetGame(userId)?.GetPlayerData(userId)?.SetDisconnectedDate(_timeProvider.GetUtcNow().LocalDateTime);

        return base.OnDisconnectedAsync(exception);
    }
}
