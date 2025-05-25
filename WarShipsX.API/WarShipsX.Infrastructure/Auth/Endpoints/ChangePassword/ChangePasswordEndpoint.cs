using FastEndpoints;
using WarShipsX.Application.Common.Extensions;
using WarShipsX.Application.Common.Models;
using WarShipsX.Infrastructure.Auth.Services;
using WarShipsX.Infrastructure.Persistence;

namespace WarShipsX.Infrastructure.Auth.Endpoints.ChangePassword;

public class ChangePasswordEndpoint(WsxDbContext context, PasswordHashService passwordHashService) : Endpoint<ChangePasswordRequest, Result>
{
    private readonly WsxDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public WsxDbContext Context => _context;

    public override void Configure()
    {
        Put("auth/password");
    }

    public override async Task HandleAsync(ChangePasswordRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var userDb = await Context.AppUsers.FindAsync([userId], ct);

        if (userDb == null)
        {
            await SendOkAsync(Result.Error("Incorrect data"), ct);
            return;
        }

        var oldPasswordCorrect = _passwordHashService.VerifyPassword(req.OldPassword, userDb!.PasswordHash);

        if (!oldPasswordCorrect)
        {
            await SendOkAsync(Result.Error("Current password incorrect"), ct);
            return;
        }

        if (req.NewPassword == req.OldPassword)
        {
            await SendOkAsync(Result.Error("New password cannot be the same as old"), ct);
            return;
        }

        userDb.PasswordHash = _passwordHashService.HashPaswordWithSalt(req.NewPassword);

        await Context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
