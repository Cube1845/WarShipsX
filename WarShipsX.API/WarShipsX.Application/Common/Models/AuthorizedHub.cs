using System.Security.Claims;

namespace WarShipsX.Application.Common.Models;

public abstract class AuthorizedHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            Context.Abort();
            return;
        }

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User connected: {userId}");

        await base.OnConnectedAsync();
    }

    protected Guid GetUserId()
    {
        return Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value!);
    }
}
