using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Attraction> Attractions { get; set; }
    public DbSet<RouteAttraction> RouteAttractions { get; set; }
    public DbSet<Path> Paths { get; set; }
    public DbSet<SearchQuery> SearchQueries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define relationships for many-to-many
        modelBuilder.Entity<RouteAttraction>()
            .HasOne(ra => ra.Route)
            .WithMany(r => r.RouteAttractions)
            .HasForeignKey(ra => ra.RouteID);

        modelBuilder.Entity<RouteAttraction>()
            .HasOne(ra => ra.Attraction)
            .WithMany(a => a.RouteAttractions)
            .HasForeignKey(ra => ra.AttractionID);
    }
}

