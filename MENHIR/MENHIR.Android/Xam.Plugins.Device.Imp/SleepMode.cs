using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using MENHIR.Droid.Xam.Plugins.Device.Imp;
using Plugin.CurrentActivity;
using Xam.Plugins.Device;
using Xamarin.Essentials;

[assembly: Xamarin.Forms.Dependency(typeof(SleepMode))]
namespace MENHIR.Droid.Xam.Plugins.Device.Imp
{
    public class SleepMode : ISleepMode
    {
        public void BlockSleepMode(bool blockSleepMode)
        {
            Xamarin.Forms.Device.BeginInvokeOnMainThread(() =>
            {
                MainActivity activity = (MainActivity)Platform.CurrentActivity;
                //MainActivity activity = (MainActivity)CrossCurrentActivity.Current.Activity;

                if (blockSleepMode)
                    activity.Window.AddFlags(WindowManagerFlags.KeepScreenOn);
                else
                    activity.Window.ClearFlags(WindowManagerFlags.KeepScreenOn);
            });
        }
    }
}