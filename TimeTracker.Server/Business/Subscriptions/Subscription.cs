namespace TimeTracker.Server.Business.Subscriptions
{
    public record Subscription(int CompanyEmploeeMaxCount, SubscriptionKind Kind, decimal PriceUsd);

    public enum SubscriptionKind
    {
        None,
        Pro,
        Advanced,
        Unlimited,
    }
}
