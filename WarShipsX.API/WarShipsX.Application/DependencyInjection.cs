using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using WarShipsX.Application.Common;

namespace WarShipsX.Application;

public static class DependencyInjection
{
    public static void AddApplicationDI(this IServiceCollection services)
    {
        services.AddExceptionHandler<ExceptionHandler>();
        services.AddProblemDetails();
    }

    public static void UseApplicationDI(this WebApplication app)
    {
        app.UseExceptionHandler();
    }
}