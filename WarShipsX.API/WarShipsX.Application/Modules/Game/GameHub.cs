using Microsoft.AspNetCore.Authorization;
using WarShipsX.Application.Common.Models;

namespace WarShipsX.Application.Modules.Game;

[Authorize]
public class GameHub : AuthorizedHub
{
}
