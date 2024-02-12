using System;
using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Android.OS;
using Plugin.DeviceOrientation;
using AndroidX.Core.App;
using AndroidX.Core.Content;
using Android;
using Plugin.CurrentActivity;
using Xamarin.Forms;
using Android.Content;
using Xam.Plugins.Notifications;
using MENHIR.Droid.Xam.Plugins.Notifications.Imp;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;

namespace MENHIR.Droid
{
    //[Activity(Label = "MENHIR", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize )]
    //[Activity(Label = "MENHIR", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    [Activity(Label = "MENHIR3Min", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation, LaunchMode = LaunchMode.SingleTop)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            //Para la orientacion
            CrossCurrentActivity.Current.Activity = this;

            base.OnCreate(savedInstanceState);

            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            global::Xamarin.Forms.Forms.Init(this, savedInstanceState);

            //MainPage.CurrentExtDirectory = Android.App.Application.Context.GetExternalFilesDir(Android.OS.Environment.DirectoryDocuments).ToString();
            MainPage.CurrentExtDirectory = Android.OS.Environment.GetExternalStoragePublicDirectory(Android.OS.Environment.DirectoryDocuments).AbsolutePath;

            LoadApplication(new App());
            Xamarin.Forms.Application.Current.On<Xamarin.Forms.PlatformConfiguration.Android>().UseWindowSoftInputModeAdjust(WindowSoftInputModeAdjust.Resize);
            //Window.SetSoftInputMode(Android.Views.SoftInput.AdjustResize);
            //AndroidBug5497WorkaroundForXamarinAndroid.assistActivity(this);
            CreateNotificationFromIntent(Intent);
        }
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }

        public override void OnConfigurationChanged(Android.Content.Res.Configuration newConfig)
        {
            base.OnConfigurationChanged(newConfig);

            DeviceOrientationImplementation.NotifyOrientationChange(newConfig.Orientation);
        }

        public override void OnBackPressed()
        {
            MessagingCenter.Send("Android", "OnBackPressed");
        }

        protected override void OnNewIntent(Intent intent)
        {
            CreateNotificationFromIntent(intent);
        }

        void CreateNotificationFromIntent(Intent intent)
        {
            if (intent?.Extras != null)
            {
                string title = intent.GetStringExtra(AndroidNotifications.TitleKey);
                string message = intent.GetStringExtra(AndroidNotifications.MessageKey);
                string data = intent.GetStringExtra(AndroidNotifications.DataKey);

                DependencyService.Get<INotifications>().ReceiveNotification(title, message, data);
            }
        }
    }
}