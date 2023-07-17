using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MENHIR.Droid.Controls
{
    public class JavascriptWebViewClient : WebViewClient
    {
        readonly string _javascript;

        public JavascriptWebViewClient(string javascript)
        {
            _javascript = javascript;
        }

        public override void OnPageCommitVisible(WebView view, string url)
        {
            view.EvaluateJavascript(_javascript, null);
            base.OnPageCommitVisible(view, url);
        }

        public override void OnPageStarted(WebView view, string url, Bitmap favicon)
        {
            view.EvaluateJavascript(_javascript, null);
            base.OnPageStarted(view, url, favicon);
            
        }

        public override void OnPageFinished(WebView view, string url)
        {
            view.EvaluateJavascript(_javascript, null);
            base.OnPageFinished(view, url);
        }
    }
}