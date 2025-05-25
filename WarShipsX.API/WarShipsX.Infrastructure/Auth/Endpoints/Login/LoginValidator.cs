using FastEndpoints;
using FluentValidation;

namespace WarShipsX.Infrastructure.Auth.Endpoints.Login;

public class LoginValidator : Validator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotNull()
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(x => x.Password)
           .NotNull()
           .NotEmpty()
           .MinimumLength(6);
    }
}
