using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
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
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) && path.Value!.Contains("hub"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services
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