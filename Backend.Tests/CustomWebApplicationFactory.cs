using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MyBackend.Data;
using System;
using System.Linq;

namespace Backend.Tests
{
    public class CustomWebApplicationFactory<TStartup>
        : WebApplicationFactory<TStartup> where TStartup : class
    {
        private SqliteConnection _connection;

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove the original DbContext
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<MyDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Create and open a shared SQLite connection
                _connection = new SqliteConnection("DataSource=:memory:");
                _connection.Open();

                // Register EF Core with this connection
                services.AddDbContext<MyDbContext>(options =>
                {
                    options.UseSqlite(_connection);
                });

                // Build the service provider
                var sp = services.BuildServiceProvider();

                // Create database schema
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
                db.Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _connection?.Close();
            _connection?.Dispose();
        }
    }
}
