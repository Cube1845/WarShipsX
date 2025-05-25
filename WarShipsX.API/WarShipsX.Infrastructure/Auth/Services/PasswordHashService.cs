using System.Security.Cryptography;
using System.Text;

namespace WarShipsX.Infrastructure.Auth.Services;

public class PasswordHashService
{
    private readonly int keySize = 64;
    private readonly int iterations = 100_000;
    private readonly HashAlgorithmName algorithm = HashAlgorithmName.SHA512;

    public string HashPaswordWithSalt(string password)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(password, nameof(password));

        var salt = RandomNumberGenerator.GetBytes(keySize);

        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            algorithm,
            keySize);

        var hashString = Convert.ToHexString(hash);
        var saltString = Convert.ToBase64String(salt);

        return $"{hashString}.{saltString}";
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(password, nameof(password));
        ArgumentException.ThrowIfNullOrWhiteSpace(hashedPassword, nameof(hashedPassword));

        var passwordParts = hashedPassword.Split('.');
        var hash = passwordParts[0];
        var salt = Convert.FromBase64String(passwordParts[1]);

        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, algorithm, keySize);
        return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
    }
}