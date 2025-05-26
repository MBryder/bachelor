using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add SQLite Database
        builder.Services.AddDbContext<MyDbContext>(options =>
            options.UseSqlite("Data Source=mydatabase.db"));

        // Add controllers and Swagger
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
        });

        // Enable CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
                policy.WithOrigins(
                        "http://localhost:5173",
                        "http://192.168.0.165:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());
        });

        // Configure JWT Authentication
        var jwtKey = builder.Configuration["Jwt:Key"];
        var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
            };
        });

        builder.Services.AddAuthorization();

        var app = builder.Build();

        // Seed data
        using (var scope = app.Services.CreateScope())
        {
            var env = app.Services.GetRequiredService<IWebHostEnvironment>();
            if (!env.IsEnvironment("Testing"))
            {
                var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
                var seeder = new DataSeeder(db);
                await seeder.SeedPlacesAsync("Data/SeedData/places.json");
                await seeder.SeedImagesAsync("Data/SeedData/images.json");
                await seeder.SeedDetailsAsync("Data/SeedData/details.json");
            }
        }

        // Enable CORS before anything else
        app.UseCors("AllowReactApp");

        // Enable Swagger in development
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Auth middleware
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseHttpsRedirection();

        app.MapControllers();

        await app.RunAsync();
    }
}
