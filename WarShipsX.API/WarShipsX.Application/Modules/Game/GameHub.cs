using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Common.Models;
using WarShipsX.Application.Modules.Game.Commands.SendPlayerData;
using WarShipsX.Application.Modules.Game.Commands.Shoot;
using WarShipsX.Application.Modules.Game.Commands.UserConnected;
using WarShipsX.Application.Modules.Game.Commands.UserDisconnected;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub(ConnectionService connectionService, GameService game) : AuthorizedHub
{
    private readonly ConnectionService _connectionService = connectionService;
    private readonly GameService _game = game;

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

        var opponentData = _game.GetGame(userId)!.GetOpponentData(userId)!;

        if (_connectionService._playerDisconnections.TryGetValue(opponentData.Id, out _) || !opponentData.InitiallyConnected)
        {
            await Clients.User(userId.ToString()).SendAsync("WaitForOpponent");
        }
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
            await Clients.User(data.OpponentId.ToString()).SendAsync("WaitForOpponent");
        }

        await _connectionService.RegisterDisconnection(userId,
            async () =>
            {
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentConnected");
            },
            async () =>
            {
                _game.RemoveGame(userId);
                await Clients.User(data.OpponentId.ToString()).SendAsync("OpponentAbandoned");
            }
        );
    }

    public async Task AbandonGame()
    {
        AuthorizeUser();

        var userId = GetUserId();

        await Clients.User(_game.GetGame(userId)?.GetOpponentData(userId)?.Id.ToString()!).SendAsync("OpponentAbandoned");
        _game.RemoveGame(userId);

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
