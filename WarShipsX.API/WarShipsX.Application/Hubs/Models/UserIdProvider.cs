using System.Security.Claims;

namespace WarShipsX.Application.Hubs.Models;

public class UserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }
}
