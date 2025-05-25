namespace WarShipsX.Infrastructure.Auth.Endpoints.ChangePassword;

public record ChangePasswordRequest(string OldPassword, string NewPassword);