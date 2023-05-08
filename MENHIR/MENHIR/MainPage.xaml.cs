using MENHIR.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xam.Plugins.SQLite;
using Xamarin.Forms;
using Xamarin.Forms.PlatformConfiguration.iOSSpecific;

namespace MENHIR
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();

            var Folder = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            webViewElement.Source = new HtmlWebViewSource()
            {
                //Html = HtmlSourceContent.Content,
                //BaseUrl = "https://www.youtube.com",
                //BaseUrl = "http://192.168.0.18:5500/index.html",
                //Html = Recursos.index,
                //Html = file.Path,
                //BaseUrl = $"file://" + Folder.Path + "/index.html",
                //BaseUrl = Folder + "/index.html",
                BaseUrl = "http://192.168.0.18:5500/index.html",
            };

            webViewElement.AddInstance("SQLite", new SQLiteAsyncConnection(Folder + "/asd.db3"));
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            MessagingCenter.Send(this, "allowLandScapePortrait");

            // https://social.msdn.microsoft.com/Forums/en-US/3fa2687f-3c8f-4e20-b5a2-b4ca0f216ee7/how-to-put-colour-in-safe-area-on-ios?forum=xamarinforms
            var safeAreaInset = On<Xamarin.Forms.PlatformConfiguration.iOS>().SafeAreaInsets();
            this.BgStack.Padding = safeAreaInset;
        }

    }
}