using Microsoft.EntityFrameworkCore;
using MyBackend.Models; // adjust to your project namespace

namespace MyBackend.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Password = "admin123" },
                new User { Id = 2, Username = "test", Password = "password" }
            );
        }
    }
}
