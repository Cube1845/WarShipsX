namespace WarShipsX.Infrastructure.Auth.Entities;

public class RefreshToken
{
    public int Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiryDate { get; set; }
    public AppUser? Owner { get; set; }

    public bool IsExpired(DateTime now)
    {
        return ExpiryDate <= now;
    }
}
