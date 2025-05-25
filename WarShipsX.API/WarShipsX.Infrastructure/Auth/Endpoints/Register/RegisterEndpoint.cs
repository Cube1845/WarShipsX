using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using WarShipsX.Application.Common.Models;
using WarShipsX.Infrastructure.Auth.Entities;
using WarShipsX.Infrastructure.Auth.Services;
using WarShipsX.Infrastructure.Persistence;

namespace WarShipsX.Infrastructure.Auth.Endpoints.Register;

public class RegisterEndpoint(WsxDbContext context, PasswordHashService passwordHashService) : Endpoint<RegisterRequest>
{
    private readonly WsxDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        if (await _context.AppUsers.AnyAsync(user => user.Email == req.Email, ct))
        {
            await SendOkAsync(Result.Error("An account with this email already exist"), ct);
            return;
        }

        var passwordHash = _passwordHashService.HashPaswordWithSalt(req.Password);


        AppUser appUser = new(req.Email, passwordHash);
        await _context.AppUsers.AddAsync(appUser, ct);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
