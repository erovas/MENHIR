using System;
using System.Collections.Generic;
using System.Text;

namespace Xam.Plugins.Notifications
{
    public class NotificationEventArgs : EventArgs
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public string Data { get; set; }
    }
}