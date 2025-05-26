using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Middleware
{
    public class UserStatusMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public UserStatusMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context, UserManager<User> userManager)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                var userId = context.User.FindFirst("userId")?.Value;
                if (!string.IsNullOrEmpty(userId))
                {
                    var user = await userManager.FindByIdAsync(userId);
                    if (user != null)
                    {
                        var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                        var tokenHandler = new JwtSecurityTokenHandler();
                        try
                        {
                            var jwtToken = tokenHandler.ReadJwtToken(token);
                            if (jwtToken.ValidTo < DateTime.UtcNow)
                            {
                                user.IsOnline = false;
                                await userManager.UpdateAsync(user);
                            }
                        }
                        catch
                        {
                            user.IsOnline = false;
                            await userManager.UpdateAsync(user);
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}