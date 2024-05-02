using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SiLA_Backend.Models;

namespace SiLA_Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Manuscript> Manuscripts { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<ReviewerSubmission> ReviewerSubmissions { get; set; }
        public DbSet<BlacklistedToken> BlacklistedTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuring the many-to-many relationship between ApplicationUser and Submission for reviews
            builder.Entity<ReviewerSubmission>()
                .HasKey(rs => new { rs.ReviewerId, rs.SubmissionId }); // Composite key

            builder.Entity<ReviewerSubmission>()
                .HasOne(rs => rs.Reviewer)
                .WithMany(u => u.ReviewSubmissions)
                .HasForeignKey(rs => rs.ReviewerId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting a reviewer deletes related records

            builder.Entity<ReviewerSubmission>()
                .HasOne(rs => rs.Submission)
                .WithMany(s => s.ReviewerSubmissions)
                .HasForeignKey(rs => rs.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting a submission deletes related records


            // Configure one-to-many relationship between ApplicationUser and Manuscript
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Manuscripts)
                .WithOne(m => m.Author)
                .HasForeignKey(m => m.AuthorId)
                .OnDelete(DeleteBehavior.Cascade); // This will delete all Manuscripts if the User is deleted


            // Configure one-to-many relationship between ApplicationUser and Submission for edit
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.EditSubmissions)
                .WithOne(s => s.Editor)
                .HasForeignKey(s => s.EditorId)
                .OnDelete(DeleteBehavior.SetNull); // Set ForeignKey to null if the Editor is deleted

            // Configure one-to-one relationship between Manuscript and Submission
            builder.Entity<Manuscript>()
                .HasOne(m => m.Submission)
                .WithOne(s => s.Manuscript)
                .HasForeignKey<Submission>(s => s.ManuscriptId)
                .OnDelete(DeleteBehavior.Cascade); // This will delete Submission if the Manuscript is deleted
        }


    }
}