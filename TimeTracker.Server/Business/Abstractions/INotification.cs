namespace TimeTracker.Business.Abstractions
{
    public interface INotification
    {
        Task SendMessage(string to, string title, string message);
    }
}
