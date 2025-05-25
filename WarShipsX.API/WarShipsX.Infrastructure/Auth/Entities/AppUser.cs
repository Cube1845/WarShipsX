namespace WarShipsX.Infrastructure.Auth.Entities;

public class AppUser(string email = "", string passwordHash = "")
{
    public Guid Id { get; set; }
    public string Email { get; set; } = email;
    public string PasswordHash { get; set; } = passwordHash;
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
