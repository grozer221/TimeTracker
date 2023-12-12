using GraphQL;
using GraphQL.Types;

using TimeTracker.Server.Business.Subscriptions;
using TimeTracker.Server.DataAccess.Repositories;
using TimeTracker.Server.GraphQL.Modules.Auth;

namespace TimeTracker.Server.GraphQL.Modules.Subscriptions
{
    public class SubscriptionsQueries : ObjectGraphType
    {
        public SubscriptionsQueries(ActiveSubscriptionRepository activeSubscriptionRepository)
        {
            Field<NonNullGraphType<SubscriptionType>, Subscription>()
               .Name("GetCurrent")
               .ResolveAsync(async context =>
               {
                   var currentSubscription = await activeSubscriptionRepository.GetCurrentAsync();
                   return currentSubscription == null
                       ? Business.Subscriptions.Subscriptions.None
                       : currentSubscription.Enrichment;
               })
               .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<SubscriptionType>>, IEnumerable<Subscription>>()
               .Name("GetAll")
               .Resolve(context =>
               {
                   return new List<Subscription>
                    {
                        Business.Subscriptions.Subscriptions.None,
                        Business.Subscriptions.Subscriptions.Pro,
                        Business.Subscriptions.Subscriptions.Advanced,
                        Business.Subscriptions.Subscriptions.Unlimited,
                    };
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
