namespace SiLA_Backend.Utilities
{
    public class UtilitiesFunctions
    {
        public static DateTime ConvertUtcToAest(DateTime utcDateTime)
        {
            var easternZone = TimeZoneInfo.FindSystemTimeZoneById("Australia/Sydney");
            var aestDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, easternZone);
            return aestDateTime;
        }
    }
}