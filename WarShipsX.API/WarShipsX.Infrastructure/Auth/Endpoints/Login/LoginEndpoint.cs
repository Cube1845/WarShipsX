using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WarShipsX.Application.Common.Models;
using WarShipsX.Infrastructure.Auth.Services;
using WarShipsX.Infrastructure.Persistence;

namespace WarShipsX.Infrastructure.Auth.Endpoints.Login;

public class LoginEndpoint(WsxDbContext context, PasswordHashService passwordHashService) : Endpoint<LoginRequest, LoginResponse>
{
    private readonly WsxDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await _context.AppUsers.FirstOrDefaultAsync(user => user.Email == req.Email, ct) ??
            throw new WsxException("Incorrect email or password");

        var passwordCorrect = _passwordHashService.VerifyPassword(req.Password, user!.PasswordHash);

        if (!passwordCorrect)
        {
            throw new WsxException("Incorrect email or password");
        }

        Response = await CreateTokenWith<TokenService>(user.Id.ToString(), u =>
        {
            u.Claims.Add(new(ClaimTypes.NameIdentifier, user.Id.ToString()));
        });
    }
}
