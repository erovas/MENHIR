using MENHIR.Controls;
using MENHIR.Helpers;
using MENHIR.JS;
using MENHIR.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xam.Plugins.AudioRecorder;
using Xam.Plugins.Device;
using Xam.Plugins.DevicePermissions;
using Xam.Plugins.Notifications;
using Xam.Plugins.SQLite;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.PlatformConfiguration;
using Xamarin.Forms.PlatformConfiguration.iOSSpecific;

namespace MENHIR
{
    public partial class MainPage : ContentPage
    {
        #region STATIC

        public static string Script { get; private set; }
        public static string UID { get; }
        public static string CurrentDirectory { get; }
        public static string CurrentExtDirectory { get; set; }
        public static Dictionary<string, Type> Types { get; }
        public static INotifications NotificationManager { get; }

        static MainPage()
        {
            UID = Guid.NewGuid().ToString();
            CurrentDirectory = CreateSRC();
            Types = new Dictionary<string, Type>();
            Script = Resx.script;
            Script = Script.Replace("-UID-", UID);
            Script = Script.Replace("-CD-", CurrentDirectory);
            
            NotificationManager = DependencyService.Get<INotifications>();
        }

        #endregion

        private Dictionary<string, object> NotificationData { get; }

        private bool Navigating { get; set; }
        private bool Navigated { get; set; }

        public MainPage()
        {
            InitializeComponent();

            this.NotificationData = new Dictionary<string, object>();

#if DEBUG
            //string BaseUrl = "http://192.168.0.18:5500/index.html";
            string BaseUrl = "http://192.168.0.25:5500/index.html";
#else
            string BaseUrl = CurrentDirectory + "/index.html";
            //string BaseUrl = "https://erovas.github.io/MENHIR2/index.html";
            //string BaseUrl = "http://192.168.0.25:5500/index.html";
#endif

            //BaseUrl = CurrentDirectory + "/index.html";

            #region PLUGINS IMPORT

            bool IsHttp = BaseUrl.Contains("http");

            var TypesList = new List<Type>();
            var JSClasses = string.Empty;

            TypesList.Add(typeof(SQLiteConnectionAsync));
            TypesList.Add(typeof(SQLiteConnection));
            TypesList.Add(typeof(AudioRecorderAsync));
            TypesList.Add(typeof(DeviceHandler));
            TypesList.Add(typeof(DevicePermissionsAsync));


            foreach (var type in TypesList)
            {
                Reflexion.SetStaticPropertyValue(type, "MainPage", this);
                Reflexion.SetStaticPropertyValue(type, "IsHttp", IsHttp);
                Reflexion.SetStaticPropertyValue(type, "RootPath", CurrentDirectory);
                Reflexion.SetStaticPropertyValue(type, "RootExtPath", CurrentDirectory);
                JSClasses += Misc.GenerateJSClass(type);
                //Types.Add(type.Name, type);
                Types[type.Name] = type;
            }

            Script = Script.Replace("/*Classes*/", JSClasses);

            Script = Script.Replace("-CED-", CurrentExtDirectory);

            #endregion

            #region NATIVE JS EVENTS

            var EventsList = new List<string>();

            EventsList.Add("OnBackPressed");

            MessagingCenter.Subscribe<string>(this, "OnBackPressed", async sender =>
            {
                await webViewElement.ExecuteJSEvent("OnBackPressed", sender);
            });


            EventsList.Add("OnNotification");

            Script = Script.Replace("['--events--']", JsonSerializer.Serialize(EventsList));

            #endregion

            webViewElement.Source = new HtmlWebViewSource()
            {
                BaseUrl = BaseUrl
            };

            

            webViewElement.Navigated += WebViewElement_Navigated;
            webViewElement.Navigating += WebViewElement_Navigating;


            //NotificationManager = DependencyService.Get<INotifications>();
            NotificationManager.NotificationReceived += (sender, eventArgs) =>
            {
                var evtData = (NotificationEventArgs)eventArgs;
                ShowNotification(evtData.Title, evtData.Message, evtData.Data);
            };

        }

        private void WebViewElement_Navigating(object sender, WebNavigatingEventArgs e)
        {
            this.Navigating = true;
        }

        private void WebViewElement_Navigated(object sender, WebNavigatedEventArgs e)
        {
            // NO se ha cargado la url como tal, se ha cargado una pagina "blank", y después si se carga el index.html como tal
            if (!this.Navigating)
                return;

            this.Navigated = true;

            // No hay datos para notificar a JS
            if (NotificationData.Count == 0)
                return;

            SetSessionStorageValue("-" + UID + "-", NotificationData);
            NotificationData.Clear();
        }

        void ShowNotification(string title, string message, string data)
        {
            //NotificationData.Clear();

            // Un falso evento de notificacion, que ocurre cuando se lanza la App
            if (title is null && message is null && data is null)
                return;


            // JsonElement[] rawArgs = ...;
            object[] rawArgs = JsonSerializer.Deserialize<object[]>(data);

            for (int i = 0; i < rawArgs.Length; i++)
                rawArgs[i] = rawArgs[i] == null ? null : Misc.JsonElementToValue((JsonElement)rawArgs[i]);

            NotificationData["title"] = title;
            NotificationData["message"] = message;
            NotificationData["args"] = rawArgs;


            // Se acaba de lanzar la App, por lo tanto el DOM y JS estan apenas cargando
            if (!this.Navigated)
            {
                SetSessionStorageValue("-" + UID + "-", NotificationData);
                NotificationData.Clear();
                return;
            }

            var temp = new Dictionary<string, object>();

            foreach (var item in NotificationData)
                temp[item.Key] = item.Value;

            NotificationData.Clear();

            // La App ya estaba lanzada (o en segundo plano), quiere decir que el DOM y JS ya estan cargados
            // Ejecutar evento "XamOnNotification"
            Device.BeginInvokeOnMainThread(async () => await webViewElement.ExecuteJSEvent("OnNotification", temp));
        }

        private void SetSessionStorageValue(string name, object data)
        {
            string value = JsonSerializer.Serialize(data);
            Device.BeginInvokeOnMainThread(async () =>
            {
                await webViewElement.EvaluateJavaScriptAsync($"sessionStorage.setItem('{name}', JSON.stringify({value}) )");
            });
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            // https://social.msdn.microsoft.com/Forums/en-US/3fa2687f-3c8f-4e20-b5a2-b4ca0f216ee7/how-to-put-colour-in-safe-area-on-ios?forum=xamarinforms
            var safeAreaInset = On<Xamarin.Forms.PlatformConfiguration.iOS>().SafeAreaInsets();
            //this.BgStack.Padding = safeAreaInset;
        }


        private static string CreateSRC()
        {
            string src = "src";

            //string rawPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string rawPath = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            string rootPath = rawPath + "/" + src;

#if DEBUG
            if (Directory.Exists(rootPath))
                return rootPath;
#else
            //Ya existe, por tanto se presume que los archivos tambien existen;

            if (Directory.Exists(rootPath))
                return rootPath;
            
#endif
            Assembly assembly = IntrospectionExtensions.GetTypeInfo(typeof(MainPage)).Assembly;
            string[] fileNames = assembly.GetManifestResourceNames();

            foreach (var name in fileNames)
            {
                //Ejemplos:         #! Evitar crear archivo de la forma myscript.for.action.js, en su lugar myscript-for-action.js
                //MENHIR.src.css.styles.css
                //MENHIR.src.html.about.html
                //MENHIR.src.img.image.jpg
                //MENHIR.src.js.script.js
                //MENHIR.src.index.html
                string[] splits = name.Split('.');

                //Descartar cualquier otro recurso incrustado no valido
                if (splits[1] != src)
                    continue;

                string filename = "";

                // src/index/
                for (int i = 1; i < splits.Length - 1; i++)
                    filename += splits[i] + "/";

                // quitar el ultimo "/"   =>   src/index
                filename = filename.Substring(0, filename.Length - 1);

                // var/.../src/index.html
                filename = rawPath + "/" + filename +  "." + splits[splits.Length - 1];
                CreateFile(filename, assembly, name);

            }

            return rootPath;
        }

        private static void CreateFile(string path, Assembly assembly, string resourceName)
        {
            //Crear directorio si NO existe
            (new FileInfo(path)).Directory.Create();

            var asd = (new FileInfo(path)).Directory;
            var dsa = asd.Root;

            //Crear archivo
            FileStream fileToWrite = File.Create(path);
            Stream embeddedStream = assembly.GetManifestResourceStream(resourceName);
            embeddedStream.Seek(0, SeekOrigin.Begin);
            embeddedStream.CopyTo(fileToWrite);
            fileToWrite.Close();
        }

    }
}