using System;
using System.ComponentModel.DataAnnotations;

public class BlacklistedToken
{
    public int Id { get; set; }

    [Required]
    public string Token { get; set; }

    public DateTime DateBlacklisted { get; set; }
}
