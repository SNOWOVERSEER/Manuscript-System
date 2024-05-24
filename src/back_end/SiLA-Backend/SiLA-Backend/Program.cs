using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SiLA_Backend.Data;
using SiLA_Backend.Models;
using SiLA_Backend.Services;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using SiLA_Backend.Utilities;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// configure cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 3, 0))));


builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// add jwt authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
        ValidateLifetime = true,
    };
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var claims = context.Principal.Claims.ToList();
            var tokenService = context.HttpContext.RequestServices.GetRequiredService<ITokenManager>();
            var token = context.SecurityToken as JsonWebToken;

            if (token != null)
            {
                var isBlacklisted = await tokenService.IsTokenBlacklisted(token.EncodedToken);
                if (isBlacklisted)
                {
                    context.Fail("This token is blacklisted");
                }
            }
            return;
        }
    };

});


// Add the missing using directive

builder.Services.AddAWSService<IAmazonS3>(new AWSOptions
{
    Region = Amazon.RegionEndpoint.APSoutheast2,
    Credentials = new BasicAWSCredentials(
        builder.Configuration["AWS:AccessKeyId"],
        builder.Configuration["AWS:SecretAccessKey"])
});
builder.Services.AddControllers();
builder.Services.Configure<MailjetSettings>(builder.Configuration.GetSection("Mailjet"));
builder.Services.AddSingleton<MailService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenManager, TokenManager>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IUrlHelperFactory, UrlHelperFactory>();
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Configure the HTTP request pipeline.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await CreateRoles(roleManager);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();
// Use CORS policy
app.UseCors();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// create roles
static async Task CreateRoles(RoleManager<IdentityRole> roleManager)
{
    string[] roleNames = { "Author", "Reviewer", "Editor" };
    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}
