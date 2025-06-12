namespace WarShipsX.Application.Modules.Lobby.Models.Game;

public class Game(PlayerData player1, PlayerData player2, Turn turn)
{
    public PlayerData Player1 { get; set; } = player1;
    public PlayerData Player2 { get; set; } = player2;
    public Turn Turn { get; set; } = turn;
}
