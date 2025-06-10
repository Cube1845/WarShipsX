using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Hubs.Lobby.Handlers;
using WarShipsX.Application.Hubs.Lobby.Models;
using WarShipsX.Application.Hubs.Models;

namespace WarShipsX.Application.Hubs.Lobby;

[Authorize]
public class LobbyHub(LobbySingleton lobby, StartGameHandler startGame) : AuthorizedHub
{
    private readonly LobbySingleton _lobby = lobby;
    private readonly StartGameHandler _startGame = startGame;

    public async Task ConnectPlayer(List<List<PositionDto>> ships)
    {
        var userId = Guid.Parse(GetUserId());

        _lobby.ConnectPlayer(new(userId, ships));

        var startGameData = await _startGame.ExecuteAsync(new PlayerData(userId, ships));

        if (startGameData != null)
        {
            await Clients.User(startGameData.Player1Id.ToString()).SendAsync("StartGame", startGameData.GameId);
            await Clients.User(startGameData.Player2Id.ToString()).SendAsync("StartGame", startGameData.GameId);
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _lobby.DisconnectPlayer(GetUserId());

        return base.OnDisconnectedAsync(exception);
    }
}
