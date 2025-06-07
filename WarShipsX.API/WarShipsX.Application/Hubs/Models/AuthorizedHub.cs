using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace WarShipsX.Application.Hubs.Models;

public abstract class AuthorizedHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.User;

        if (user?.Identity?.IsAuthenticated == true)
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"User connected: {userId}");
        }
        else
        {
            Console.WriteLine("Unauthenticated connection.");
        }

        await base.OnConnectedAsync();
    }
}
