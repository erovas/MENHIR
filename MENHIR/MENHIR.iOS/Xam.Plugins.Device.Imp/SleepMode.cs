using MENHIR.iOS.Xam.Plugins.Device.Imp;
using UIKit;
using Xam.Plugins.Device;

[assembly: Xamarin.Forms.Dependency(typeof(SleepMode))]
namespace MENHIR.iOS.Xam.Plugins.Device.Imp
{
    [Foundation.Preserve(AllMembers = true)]
    public class SleepMode : ISleepMode
    {
        public void BlockSleepMode(bool blockSleepMode)
        {
            Xamarin.Forms.Device.BeginInvokeOnMainThread(() =>
            {
                UIApplication.SharedApplication.IdleTimerDisabled = blockSleepMode;
            });
        }
    }
}