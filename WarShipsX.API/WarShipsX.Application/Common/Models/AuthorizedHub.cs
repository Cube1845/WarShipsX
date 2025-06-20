using System.Security.Claims;

namespace WarShipsX.Application.Common.Models;

public abstract class AuthorizedHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        AuthorizeUser();
        await base.OnConnectedAsync();
    }

    protected void AuthorizeUser()
    {
        var user = Context.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            Context.Abort();
            return;
        }
    }

    protected Guid GetUserId()
    {
        return Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value!);
    }
}
