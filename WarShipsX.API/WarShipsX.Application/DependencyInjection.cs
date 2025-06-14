using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using WarShipsX.Application.Common;
using WarShipsX.Application.Modules.Game;
using WarShipsX.Application.Modules.Lobby;
using WarShipsX.Infrastructure;

namespace WarShipsX.Application;

public static class DependencyInjection
{
    public static void AddApplicationDI(this IServiceCollection services)
    {
        services.AddExceptionHandler<ExceptionHandler>();
        services.AddProblemDetails();

        services.AddSignalR();

        services.AddSingleton<LobbyService>();
        services.AddSingleton<GameService>();
    }

    public static void UseApplicationDI(this WebApplication app)
    {
        app.UseExceptionHandler();

        app.MapHub<LobbyHub>("/api/lobby-hub");
        app.MapHub<GameHub>("/api/game-hub");
    }
}