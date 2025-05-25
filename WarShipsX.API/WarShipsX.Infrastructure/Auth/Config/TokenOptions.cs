namespace WarShipsX.Infrastructure.Auth.Config;

public class TokenOptions
{
    public const string Jwt = "JwtSettings";
    public string SecretKey { get; set; } = string.Empty;
    public double AccessTokenExpirationSeconds { get; set; }
    public double RefreshTokenExpirationSeconds { get; set; }
}
