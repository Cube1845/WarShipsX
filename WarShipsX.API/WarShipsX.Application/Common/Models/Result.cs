namespace WarShipsX.Application.Common.Models;
public class Result
{
    public bool IsSuccess { get; protected set; }
    public string? Message { get; protected set; }

    protected Result(bool isSuccess, string? message = null)
    {
        IsSuccess = isSuccess;
        Message = message;
    }

    public static Result Success(string? message = null)
    {
        return new(true, message);
    }

    public static Result Error(string message)
    {
        return new(false, message);
    }
}

public sealed class Result<T> : Result where T : class
{
    public T? Value { get; private set; }

    private Result(T? value, bool isSuccess, string? message = null) : base(isSuccess, message)
    {
        Value = value;
    }

    public static Result<T> Success(T value, string? message = null)
    {
        return new(value, true, message);
    }

    public static new Result<T> Error(string? message = null)
    {
        return new(null, false, message);
    }
}

