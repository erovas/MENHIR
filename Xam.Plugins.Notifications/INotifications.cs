using System;
using System.Collections.Generic;
using System.Text;

namespace Xam.Plugins.Notifications
{
    public interface INotifications
    {
        event EventHandler NotificationReceived;
        void Initialize();
        void SendNotification(string title, string message, DateTime? notifyTime = null, string data = null);
        void ReceiveNotification(string title, string message, string data = null);
    }
}