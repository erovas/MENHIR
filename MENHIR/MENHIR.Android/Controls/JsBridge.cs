using Android.Webkit;
using Java.Interop;
using MENHIR.Controls;
using System;

namespace MENHIR.Droid.Controls
{
    public class JsBridge : Java.Lang.Object
    {
        readonly WeakReference<HybridWebViewAndroid> HybridWebViewMainRenderer;

        public JsBridge(HybridWebViewAndroid hybridRenderer)
        {
            HybridWebViewMainRenderer = new WeakReference<HybridWebViewAndroid>(hybridRenderer);
        }

        [JavascriptInterface]
        [Export("invokeAction")]
        public void InvokeAction(string data)
        {
            //if (HybridWebViewMainRenderer != null && HybridWebViewMainRenderer.TryGetTarget(out var hybridRenderer))
            if (HybridWebViewMainRenderer.TryGetTarget(out var hybridRenderer))
            {
                var dataBody = data;
                ((HybridWebView)hybridRenderer.Element).InvokeAction(dataBody);
            }
        }
    }
}