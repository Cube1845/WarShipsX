using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WarShipsX.Application.Common.Interfaces;
using WarShipsX.Infrastructure.Auth.Config;
using WarShipsX.Infrastructure.Auth.Services;
using WarShipsX.Infrastructure.Persistence;

namespace WarShipsX.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureDI(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<WsxDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("SqlServer"));
        });

        services.AddScoped<IWsxDbContext, WsxDbContext>();

        services.AddScoped<PasswordHashService>();
        services.AddScoped<TokenService>();
        services.AddScoped<TokenConfiguration>();

        services.Configure<TokenOptions>(configuration.GetSection(TokenOptions.Jwt));

        services
            .AddAuthenticationJwtBearer(s => s.SigningKey = configuration["JwtSettings:SecretKey"]!)
            .AddAuthorization()
            .AddFastEndpoints();

        services.Configure<JwtCreationOptions>(o => o.SigningKey = configuration["JwtSettings:SecretKey"]!);
    }

    public static void UseInfrastructureDI(this WebApplication app)
    {
        app
            .UseAuthentication()
            .UseAuthorization()
            .UseFastEndpoints(config =>
            {
                config.Endpoints.RoutePrefix = "api";
                config.Errors.ResponseBuilder = (failures, ctx, _) =>
                {
                    ctx.Response.ContentType = "application/json";
                    return ErrorResponseBuilder.Build(failures);
                };
            });
    }
}