namespace SiLA_Backend.Utilities
{
    public enum SubmissionStatus
    {
        Submitted,          // Submitted by author
        ToBeReviewed,       // Assigned to reviewers
        Reviewed,          // Reviewed by reviewers
        Expired,            // Review deadline passed or rejected by reviewers
        WaitingForDecision,  // Comments received from reviewers, hand to editor
        Accepted,           // Approved by editor
        Rejected,           // Rejected by editor
        Revised,             // Revised by author
        Resubmitted,        // Resubmitted by author
        Withdrawn           // Withdrawn by author
    }

}