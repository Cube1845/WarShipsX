using WarShipsX.Application.Common.Models;
using WarShipsX.Application.Modules.Game.Models;

namespace WarShipsX.Application.Modules.Game;

public class GameService
{
    private readonly List<Models.Game> _games = [];
    private readonly Lock _lock = new();

    public void CreateNewGame(PlayerData player1, PlayerData player2)
    {
        lock (_lock)
        {
            if (_games.Any(g =>
                g.Player1.Id == player1.Id ||
                g.Player1.Id == player2.Id ||
                g.Player2.Id == player1.Id ||
                g.Player2.Id == player2.Id
            ))
            {
                throw new WsxException("One of the players is already in game");
            }

            Models.Game game = new(player1, player2, (Turn)Random.Shared.Next(1, 3));

            _games.Add(game);
        } 
    }

    public void RemoveGame(Guid playerId)
    {
        lock (_lock)
        {
            _games.RemoveAll(g => g.Player1.Id == playerId || g.Player2.Id == playerId);
        }
    }

    public Models.Game? GetGame(Guid playerId)
    {
        lock (_lock)
        {
            return _games.FirstOrDefault(g => g.Player1.Id == playerId || g.Player2.Id == playerId);
        }
    }
}
