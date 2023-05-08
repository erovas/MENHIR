using Foundation;
using MENHIR.Controls;
using MENHIR.iOS.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UIKit;
using WebKit;
using Xamarin.Forms;
using Xamarin.Forms.Platform.iOS;

[assembly: ExportRenderer(typeof(HybridWebView), typeof(HybridWebViewiOS))]
namespace MENHIR.iOS.Controls
{
    public class HybridWebViewiOS : WkWebViewRenderer, IWKScriptMessageHandler
    {
        private const string JavaScriptFunction = @"
            window['-_-'] = {
                ID: 0,
                Handlers: {},
                Send: function(name, methodName, parameters){
                    return new Promise((resolve, reject) => {
                        const handle = 'm' + this.ID++;
                        this.Handlers[handle] = { resolve, reject };
                        const data = JSON.stringify({ID: handle, Name: name, MethodName: methodName, Parameters: parameters });
                        window.webkit.messageHandlers.invokeAction.postMessage(data);
                    });
                },
                Post: function(ID, error, data){
                    if(error)
                        this.Handlers[ID].reject(data);
                    else
                        this.Handlers[ID].resolve(data);

                    delete this.Handlers[ID];
                }
            }
            /* function invokeXamarinFormsAction(data){window.webkit.messageHandlers.invokeAction.postMessage(data);} */
        ";
        private WKUserContentController _userController;

        public HybridWebViewiOS() : this(new WKWebViewConfiguration())
        {
        }

        public HybridWebViewiOS(WKWebViewConfiguration config) : base(config)
        {
            _userController = config.UserContentController;
            var script = new WKUserScript(new NSString(JavaScriptFunction), WKUserScriptInjectionTime.AtDocumentEnd, false);
            _userController.AddUserScript(script);
            _userController.AddScriptMessageHandler(this, "invokeAction");


            //==================================//

            config.Preferences.JavaScriptCanOpenWindowsAutomatically = true;
            config.Preferences.JavaScriptEnabled = true;
            config.Preferences.SetValueForKey(NSObject.FromObject(true), new NSString("allowFileAccessFromFileURLs"));
            config.AllowsInlineMediaPlayback = true;
            config.AllowsPictureInPictureMediaPlayback = true;

            if (UIDevice.CurrentDevice.CheckSystemVersion(10, 0))
            {
                config.MediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypes.None;
            }
            else
            {
                config.MediaPlaybackRequiresUserAction = false;
            }

        }

        protected override void OnElementChanged(VisualElementChangedEventArgs e)
        {
            base.OnElementChanged(e);

            if (e.OldElement != null)
            {
                _userController.RemoveAllUserScripts();
                _userController.RemoveScriptMessageHandler("invokeAction");
                HybridWebView hybridWebViewMain = e.OldElement as HybridWebView;
                hybridWebViewMain?.Cleanup();
            }

            if (e.NewElement != null)
            {
                //// No need this since we're loading dynamically generated HTML content
                //string filename = Path.Combine(NSBundle.MainBundle.BundlePath, $"Content/{((HybridWebView)Element).Uri}");
                //LoadRequest(new NSUrlRequest(new NSUrl(filename, false)));
                //var xfWebView = (HybridWebView)this.Element;
                //var source = (HtmlWebViewSource)xfWebView.Source;
                //LoadRequest(new NSUrlRequest(new NSUrl(source.BaseUrl, false)));
            }

            var xfWebView = (HybridWebView)this.Element;
            var source = (HtmlWebViewSource)xfWebView.Source;

            if (source.BaseUrl.Contains("http"))
            {
                this.LoadUrl(source.BaseUrl);
                return;
            }


            var fileUrl = new NSUrl(source.BaseUrl, false);
            // Se le quita el index.html del final
            var urltemp = source.BaseUrl.Substring(0, source.BaseUrl.Length - 10);
            var fileBaseUrl = new NSUrl(urltemp, true);
            this.LoadFileUrl(fileUrl, fileBaseUrl);
        }

        public void DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
        {
            var dataBody = message.Body.ToString();
            ((HybridWebView)Element).InvokeAction(dataBody);
        }
    }
}