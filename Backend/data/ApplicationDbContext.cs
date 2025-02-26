using Microsoft.EntityFrameworkCore;
using MyBackend.Models; // Make sure this namespace matches your project

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }  // Ensure 'User' model exists
}
