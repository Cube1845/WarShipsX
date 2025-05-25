using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WarShipsX.Infrastructure.Auth.Config;
using WarShipsX.Infrastructure.Auth.Endpoints.Login;
using WarShipsX.Infrastructure.Auth.Entities;
using WarShipsX.Infrastructure.Persistence;

namespace WarShipsX.Infrastructure.Auth.Services;

public class TokenService : RefreshTokenService<TokenRequest, LoginResponse>
{
    private readonly TokenConfiguration _tokenConfiguration;
    private readonly WsxDbContext _context;
    private readonly TimeProvider _timeProvider;

    public TokenService(TokenConfiguration tokenConfiguration, WsxDbContext context, TimeProvider timeProvider)
    {
        _tokenConfiguration = tokenConfiguration;
        _context = context;
        _timeProvider = timeProvider;

        Setup(o =>
        {
            o.TokenSigningKey = _tokenConfiguration.GetTokenConfiguration().SecretKey;
            o.AccessTokenValidity = TimeSpan.FromSeconds(_tokenConfiguration.GetTokenConfiguration().AccessTokenExpirationSeconds);
            o.RefreshTokenValidity = TimeSpan.FromSeconds(_tokenConfiguration.GetTokenConfiguration().RefreshTokenExpirationSeconds);

            o.Endpoint("/auth/refresh", ep => {});
        });
    }

    public override async Task PersistTokenAsync(LoginResponse response)
    {
        var userId = Guid.Parse(response.UserId);
        var createdAt = response.RefreshExpiryDateTime.Subtract(TimeSpan.FromSeconds(_tokenConfiguration.GetTokenConfiguration().RefreshTokenExpirationSeconds));

        var refreshToken = new RefreshToken()
        {
            OwnerId = userId,
            Token = response.RefreshToken,
            CreatedAt = createdAt,
            ExpiryDate = response.RefreshExpiryDateTime
        };

        await _context.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
    }

    public override async Task RefreshRequestValidationAsync(TokenRequest req)
    {
        if (!Guid.TryParse(req.UserId, out Guid userId))
        {
            AddError("Wrong user ID");
            return;
        }

        var user = await _context.AppUsers
            .Include(appUser => appUser.RefreshTokens)
            .FirstOrDefaultAsync(user => user.Id == userId);

        if (user == null)
        {
            AddError("User doesn't exist");
            return;
        }

        var refreshToken = user.RefreshTokens.FirstOrDefault(token => token.Token == req.RefreshToken);

        if (refreshToken == null)
        {
            AddError("Invalid token");
            return;
        }

        if (refreshToken.IsExpired(_timeProvider.GetUtcNow().LocalDateTime))
        {
            _context.RefreshTokens.Remove(refreshToken);
            await _context.SaveChangesAsync();

            AddError("Token expired");
            return;
        }

        _context.RefreshTokens.Remove(refreshToken);
        await _context.SaveChangesAsync();
    }

    public override Task SetRenewalPrivilegesAsync(TokenRequest request, UserPrivileges privileges)
    {
        privileges.Claims.Add(new(ClaimTypes.NameIdentifier, request.UserId));
        return Task.CompletedTask;
    }
}
