using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using WarShipsX.Application.Common.Models;

namespace WarShipsX.Application.Common;

public sealed class ExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken ct)
    {
        if (exception.GetType() != typeof(ValidationException) && exception.GetType() != typeof(WsxException))
        {
            return false;
        }

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        httpContext.Response.ContentType = "application/json";

        Result result = Result.Error(exception.Message);

        await httpContext.Response
            .WriteAsJsonAsync(result, ct);

        return true;
    }
}
