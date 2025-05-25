using Microsoft.Extensions.Options;

namespace WarShipsX.Infrastructure.Auth.Config;

public class TokenConfiguration(IOptions<TokenOptions> tokenOptions)
{
    private readonly TokenOptions _tokenOptions = tokenOptions.Value;

    public TokenOptions GetTokenConfiguration()
    {
        return _tokenOptions;
    }
}
