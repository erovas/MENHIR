using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using MENHIR.Controls;
using MENHIR.Droid.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(HybridWebView), typeof(HybridWebViewAndroid))]
namespace MENHIR.Droid.Controls
{
    public class HybridWebViewAndroid : WebViewRenderer
    {
        Android.Content.Context _context;

        public HybridWebViewAndroid(Android.Content.Context context) : base(context)
        {
            _context = context;
        }

        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.WebView> e)
        {
            base.OnElementChanged(e);

            if (e.OldElement != null)
            {
                Control.RemoveJavascriptInterface("jsBridge");
                //((HybridWebView)Element).Cleanup();
            }
            if (e.NewElement != null)
            {
                /*
                this.Control.Settings.DomStorageEnabled = true;
                this.Control.Settings.AllowUniversalAccessFromFileURLs = true;
                this.Control.Settings.SetSupportZoom(true);
                this.Control.Settings.BuiltInZoomControls = false;
                this.Control.Settings.DisplayZoomControls = false;
                this.Control.Settings.AllowFileAccess = true;
                this.Control.Settings.AllowFileAccessFromFileURLs = true;
                this.Control.Settings.AllowUniversalAccessFromFileURLs = true;
                this.Control.Settings.MediaPlaybackRequiresUserGesture = false;
                */
                //string Script = MainPage.Script.Replace("/*Bridge*/", "jsBridge.invokeAction(data);");
                //Control.SetWebViewClient(new JavascriptWebViewClient($"javascript: {Script}"));
                /*Control.SetWebViewClient(new JavascriptWebViewClient(Script));
                Control.AddJavascriptInterface(new JsBridge(this), "jsBridge");
                //// No need this since we're loading dynamically generated HTML content
                //Control.LoadUrl($@"file:///android_asset/Content/{((HybridWebView)Element).Uri}");


                var xfWebView = (HybridWebView)this.Element;
                var source = (HtmlWebViewSource)xfWebView.Source;
                this.Control.LoadUrl(source.BaseUrl);
                */
            }

            this.Control.Settings.DomStorageEnabled = true;
            this.Control.Settings.AllowUniversalAccessFromFileURLs = true;
            this.Control.Settings.SetSupportZoom(true);
            this.Control.Settings.BuiltInZoomControls = false;
            this.Control.Settings.DisplayZoomControls = false;
            this.Control.Settings.AllowFileAccess = true;
            this.Control.Settings.AllowFileAccessFromFileURLs = true;
            this.Control.Settings.AllowUniversalAccessFromFileURLs = true;
            this.Control.Settings.MediaPlaybackRequiresUserGesture = false;

            string Script = MainPage.Script.Replace("/*Bridge*/", "jsBridge.invokeAction(data);");
            Control.SetWebViewClient(new JavascriptWebViewClient(Script));
            Control.AddJavascriptInterface(new JsBridge(this), "jsBridge");

            var xfWebView = (HybridWebView)this.Element;
            var source = (HtmlWebViewSource)xfWebView.Source;
            this.Control.LoadUrl(source.BaseUrl);
        }
    }
}