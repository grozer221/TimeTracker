using GraphQL.Types;

using TimeTracker.Server.Business.Subscriptions;

namespace TimeTracker.Server.GraphQL.Modules.Subscriptions
{
    public class SubscriptionType : ObjectGraphType<Subscription>
    {
        public SubscriptionType() : base()
        {
            Field<SubscriptionKindEnumerationType, SubscriptionKind>()
               .Name("Kind")
               .Resolve(context => context.Source.Kind);

            Field<NonNullGraphType<DecimalGraphType>, decimal>()
               .Name("PriceUsd")
               .Resolve(context => context.Source.PriceUsd);

            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("CompanyEmploeeMaxCount")
               .Resolve(context => context.Source.CompanyEmploeeMaxCount);
        }
    }

}
