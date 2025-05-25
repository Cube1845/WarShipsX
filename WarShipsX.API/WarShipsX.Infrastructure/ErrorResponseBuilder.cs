using FluentValidation.Results;
using WarShipsX.Application.Common.Models;

namespace WarShipsX.Infrastructure;

public static class ErrorResponseBuilder
{
    public static Result Build(List<ValidationFailure> failures)
    {
        var message = string.Join(" ", failures.Select(x => x.ErrorMessage));
        return Result.Error(message);
    }
}