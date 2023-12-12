namespace TimeTracker.Server.Business.Subscriptions
{
    public class Subscriptions
    {
        public static Subscription None { get; set; } = new Subscription(
            CompanyEmploeeMaxCount: 3,
            SubscriptionKind.None,
            PriceUsd: 0);

        public static Subscription Pro { get; set; } = new Subscription(
            CompanyEmploeeMaxCount: 500,
            SubscriptionKind.Pro,
            PriceUsd: 5);

        public static Subscription Advanced { get; set; } = new Subscription(
            CompanyEmploeeMaxCount: 5000,
            SubscriptionKind.Advanced,
            PriceUsd: 15);

        public static Subscription Unlimited { get; set; } = new Subscription(
            CompanyEmploeeMaxCount: int.MaxValue,
            SubscriptionKind.Unlimited,
            PriceUsd: 30);

        public static Subscription Get(SubscriptionKind type)
            => type switch
            {
                SubscriptionKind.Pro => Pro,
                SubscriptionKind.Advanced => Advanced,
                SubscriptionKind.Unlimited => Unlimited,
                _ => None,
            };
    }
}
