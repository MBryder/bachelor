using Microsoft.EntityFrameworkCore;
using MyBackend.Models;

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


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Password = "admin123" },
                new User { Id = 2, Username = "test", Password = "password" }
            );

            modelBuilder.Entity<Place>()
                .HasMany(p => p.Photos)
                .WithOne(photo => photo.Place)
                .HasForeignKey(photo => photo.PlaceId);

            modelBuilder.Entity<Place>()
                .HasMany(p => p.Types)
                .WithOne(type => type.Place)
                .HasForeignKey(type => type.PlaceId);

            modelBuilder.Entity<Image>()
                .HasOne(i => i.Place)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.PlaceId)
                .HasPrincipalKey(p => p.PlaceId);
        }
    }
}
