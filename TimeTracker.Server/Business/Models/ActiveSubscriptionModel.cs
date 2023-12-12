using TimeTracker.Business.Abstractions;
using TimeTracker.Server.Business.Subscriptions;

namespace TimeTracker.Business.Models
{
    public class ActiveSubscriptionModel : BaseModel
    {
        public Guid? CompanyId { get; set; }

        public int TypeNumber { get; private set; }

        public SubscriptionKind Type
        {
            get => (SubscriptionKind)TypeNumber;
            set => TypeNumber = (int)value;
        }

        public Subscription Enrichment => Subscriptions.Get(Type);
    }
}
