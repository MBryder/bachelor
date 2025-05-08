using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyBackend.Models;
using System.Collections.Generic;
using System.Text.Json;
using RouteModel = MyBackend.Models.Route;

namespace MyBackend.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<PlaceType> PlaceTypes { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Details> Details { get; set; }
        public DbSet<RouteModel> Routes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Declare Username as a key so it can be used as a foreign key
            modelBuilder.Entity<User>()
                .HasAlternateKey(u => u.Username);

            // Seed users (optional, for testing)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@mail.com",
                    Password = "admin123",
                    DateOfCreation = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    Username = "test",
                    Email = "test@mail.com",
                    Password = "password",
                    DateOfCreation = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Place-Photo: one-to-many
            modelBuilder.Entity<Place>()
                .HasMany(p => p.Photos)
                .WithOne(photo => photo.Place)
                .HasForeignKey(photo => photo.PlaceId);

            // Place-Types: one-to-many
            modelBuilder.Entity<Place>()
                .HasMany(p => p.Types)
                .WithOne(type => type.Place)
                .HasForeignKey(type => type.PlaceId);

            // Place-Images: one-to-many
            modelBuilder.Entity<Image>()
                .HasOne(i => i.Place)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.PlaceId)
                .HasPrincipalKey(p => p.PlaceId);

            // Place-Details: one-to-one (based on PlaceId)
            modelBuilder.Entity<Place>()
                .HasOne(p => p.Details)
                .WithOne(d => d.Place)
                .HasForeignKey<Details>(d => d.PlaceId)
                .HasPrincipalKey<Place>(p => p.PlaceId);

            // JSON serialization for WeekdayText and Types (stored as strings in SQLite)
            var stringListConverter = new ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );

            modelBuilder.Entity<Details>()
                .Property(d => d.WeekdayText)
                .HasConversion(stringListConverter);

            modelBuilder.Entity<Details>()
                .Property(d => d.Types)
                .HasConversion(stringListConverter);

            modelBuilder.Entity<RouteModel>()
                .HasOne(r => r.User)
                .WithMany(u => u.Routes)
                .HasForeignKey(r => r.Username)
                .HasPrincipalKey(u => u.Username)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RouteModel>()
                .Property(r => r.Waypoints)
                .HasConversion(stringListConverter);
        }
    }
}
