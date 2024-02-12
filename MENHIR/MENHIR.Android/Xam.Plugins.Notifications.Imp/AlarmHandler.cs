using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MENHIR.Droid.Xam.Plugins.Notifications.Imp
{
    [BroadcastReceiver(Enabled = true, Label = "Local Notifications Broadcast Receiver")]
    public class AlarmHandler : BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            if (intent?.Extras != null)
            {
                string title = intent.GetStringExtra(AndroidNotifications.TitleKey);
                string message = intent.GetStringExtra(AndroidNotifications.MessageKey);
                string data = intent.GetStringExtra(AndroidNotifications.DataKey);

                AndroidNotifications manager = AndroidNotifications.Instance ?? new AndroidNotifications();
                manager.Show(title, message, data);
            }
        }
    }
}