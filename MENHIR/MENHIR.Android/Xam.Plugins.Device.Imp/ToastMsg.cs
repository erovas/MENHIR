using Android.App;
using Android.Widget;
using MENHIR.Droid.Xam.Plugins.Device.Imp;
using Xam.Plugins.Device;

[assembly: Xamarin.Forms.Dependency(typeof(ToastMsg))]
namespace MENHIR.Droid.Xam.Plugins.Device.Imp
{
    public class ToastMsg : IToastMsg
    {
        public void LongAlert(string message)
        {
            Toast.MakeText(Application.Context, message, ToastLength.Long).Show();
        }

        public void ShortAlert(string message)
        {
            Toast.MakeText(Application.Context, message, ToastLength.Short).Show();
        }
    }
}