namespace WarShipsX.Application.Modules.Game.Models;

public class Game(PlayerData player1, PlayerData player2, Turn turn)
{
    public PlayerData Player1 { get; private init; } = player1;
    public PlayerData Player2 { get; private init; } = player2;
    public Turn Turn { get; private set; } = turn;

    public void ChangeTurn()
    {
        if (Turn == Turn.Player1)
        {
            Turn = Turn.Player2;
            return;
        }

        Turn = Turn.Player1;
    }

    public PlayerData? GetPlayerData(Guid playerId)
    {
        if (Player1.Id == playerId)
        {
            return Player1;
        }

        if (Player2.Id == playerId)
        {
            return Player2;
        }

        return null;
    }
}
