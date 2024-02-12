using MENHIR.Utils;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xam;
using Xam.Plugins.Notifications;
using Xamarin.Essentials;
using Xamarin.Forms;
using static Xam.Plugins.SQLite.SQLite3;

namespace MENHIR.Controls
{
    public class HybridWebView : WebView
    {
        private Dictionary<string, object> Instances { get; }
        private Type TaskType { get; }
        private bool IsAndroid { get; }


        public HybridWebView() 
        {
            this.IsAndroid = DeviceInfo.Platform == DevicePlatform.Android;
            this.Instances = new Dictionary<string, object>();
            this.TaskType = typeof(Task);
        }

        public string Cleanup()
        {
            foreach (var item in Instances)
                try
                {
                    ((IDisposable)item.Value).Dispose();
                }
                catch (Exception)
                {
                }
            
            this.Instances.Clear();
            return "Instances cleared";
        }

        public string CleanInstance(string uid)
        {
            object instance = this.Instances[uid];

            try
            {
                ((IDisposable)instance).Dispose();
            }
            catch (Exception)
            {
            }

            this.Instances.Remove(uid);
            return "Intance of [" + instance.GetType().Name + "] cleared";
        }

        public async void InvokeAction(string parameters)
        {
            if (MainThread.IsMainThread)
                await DoAction(parameters);
            else
                MainThread.BeginInvokeOnMainThread(async () => await DoAction(parameters));
        }

        private async Task DoAction(string parameters)
        {
            bool error = false;
            object data = null;
            string ID = string.Empty;

            try
            {
                Entity entity = JsonSerializer.Deserialize<Entity>(parameters);
                ID = entity.ID;

                for (int i = 0; i < entity.Parameters.Length; i++)
                    entity.Parameters[i] = entity.Parameters[i] == null? null : Misc.JsonElementToValue((JsonElement)entity.Parameters[i]);

                //Se quiere crear una instancia de Classe nativa C#
                if (entity.UID == "-CI-")
                    data = ExecuteConstructor(entity);

                else if (entity.UID == "-CU-")
                    if (string.IsNullOrWhiteSpace(entity.Method))
                        data = Cleanup();
                    else
                        data = CleanInstance(entity.Method);

                else if (entity.UID == "-RE-")
                    this.Reload();

                else if (entity.UID == "-CLOSE-")
                    System.Diagnostics.Process.GetCurrentProcess().Kill();

                else if (entity.UID == "-RTF-")
                    data = File.ReadAllText(entity.Method);

                else if (entity.UID == "-RF64-")
                    data = Convert.ToBase64String(File.ReadAllBytes(entity.Method));

                else if(entity.UID == "-NTF-")
                    SendNotification(entity);

                else
                {
                    object instance = this.Instances[entity.UID];
                    Type type = instance.GetType();

                    BindingFlags flag;
                    object resultRaw;

                    //Getter
                    if (entity.IsGetSet && entity.Parameters.Length == 0)
                        flag = BindingFlags.GetProperty;

                    //Setter
                    else if (entity.IsGetSet && entity.Parameters.Length > 0)
                        flag = BindingFlags.SetProperty;

                    //Method
                    else
                        flag = BindingFlags.InvokeMethod;

                    resultRaw = type.InvokeMember(entity.Method, flag, null, instance, entity.Parameters);

                    if (resultRaw == null)
                        data = null;
                    else
                    {
                        Type resultType = resultRaw.GetType();

                        if (this.TaskType.IsAssignableFrom(resultType))
                        {
                            await (Task)resultRaw;
                            var result = resultRaw.GetType().GetProperty("Result");
                            if (result != null)
                                data = result.GetValue(resultRaw, null);
                            else
                                data = null;
                        }
                        else
                            data = resultRaw;
                    }
                }
            }
            
            catch (XamException ex)
            {
                data = "";
                data += "type: " + ex.Type + Environment.NewLine;
                data += "message: " + ex.Message + Environment.NewLine;
                data += ex.StackTrace + Environment.NewLine;
                error = true;
            }
            catch (Exception ex)
            {
                data = "";
                data += "message: " + ex.Message + Environment.NewLine;
                data += "parameters: " + parameters + Environment.NewLine;
                data += ex.StackTrace + Environment.NewLine;
                error = true;
            }

            await ExecuteJS(ID, error, data);
        }

        private void SendNotification(Entity entity)
        {
            string title = entity.Method;
            string message = entity.Parameters[0].ToString();
            long? notifyTime = (long?)entity.Parameters[1];
            List<object> rawArgs = new List<object>();

            for (int i = 2; i < entity.Parameters.Length; i++)
                rawArgs.Add(entity.Parameters[i]);
            
            string args = JsonSerializer.Serialize(rawArgs);

            if(notifyTime is null)
            {
                MainPage.NotificationManager.SendNotification(title, message, null, args);
                return;
            }

            //DateTime time = new DateTime((long)notifyTime);
            //DateTime time = new DateTime((long)notifyTime);
            var time = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    .AddMilliseconds((long)notifyTime)
                    .ToLocalTime();


            MainPage.NotificationManager.SendNotification(title, message, time, args);

            //notifications.SendNotification(entity.Parameters[0].ToString(), entity.Parameters[1].ToString(), DateTime.Now.AddSeconds(10));
        }

        private string ExecuteConstructor(Entity entity)
        {
            string TypeName = entity.Method;

            if (!MainPage.Types.ContainsKey(TypeName))
                throw new XamException("Plugin \"" + TypeName + "\" not exists", "Plugin constructor");

            var type = MainPage.Types[TypeName];

            var UID = Guid.NewGuid().ToString();
            var instance = Activator.CreateInstance(type, entity.Parameters);
            this.Instances[UID] = instance;
            return UID;
        }

        private async Task ExecuteJS(string ID, bool error, object data)
        {
            string result;

            try
            {
                result = FormatResult(data);
            }
            catch (Exception ex)
            {
                error = true;
                result = FormatResultError(data, ex);
            }

            string js = $"window['-{MainPage.UID}-'].Post('{ID}', {error.ToString().ToLower()}, {result})";

            await this.EvaluateJavaScriptAsync(js);
        }

        public async Task ExecuteJSEvent(string name, object data) 
        {
            string result = string.Empty;
            bool error = false;

            try
            {
                result = FormatResult(data);
            }
            catch (Exception ex)
            {
                error = true;
                result = FormatResultError(data, ex);
            }

            string js = $"window['-{MainPage.UID}-'].FireEvent('{name}', {error.ToString().ToLower()}, {result})";

            if (MainThread.IsMainThread)
                await this.EvaluateJavaScriptAsync(js);
            else
                MainThread.BeginInvokeOnMainThread(async () => await this.EvaluateJavaScriptAsync(js));
        }

        private string FormatResult(object data)
        {
            string result;

            // Es iOS, se requiere hacer un formateo previo para tratar con letras del tipo "\n"
            if (!this.IsAndroid)
            {
                bool rawHasSlash = false;

                //El texto original NO formateado, contiene al menos un slash "\", se reemplaza por unos caracteres raros
                if (data != null && data.GetType() == typeof(string) && data.ToString().Contains(@"\"))
                {
                    data = data.ToString().Replace(@"\", "@$~|");
                    rawHasSlash = true;
                }


                result = JsonSerializer.Serialize(data);
                if (result.Contains(@"\"))
                    result = result.Replace(@"\", @"\\");

                if (rawHasSlash)
                    result = result.Replace("@$~|", @"\\\");
            }
            else
                result = JsonSerializer.Serialize(data);

            return result;
        }
    
        private string FormatResultError(object data, Exception ex)
        {
            string result;

            result = "message: JsonSerializer fail - " + ex.Message + Environment.NewLine + "raw-data: ";

            try
            {
                result += data.ToString();
            }
            catch (Exception)
            {
                result += data + "";
            }

            return result + Environment.NewLine;
        }
    
    }

    internal class Entity
    {
        /// <summary>
        /// ID de la promesa
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// Identificador unico de instancia de objeto nativo
        /// </summary>
        public string UID { get; set; }

        /// <summary>
        /// Nombre del metodo/constructor a invocar
        /// </summary>
        public string Method { get; set; }

        /// <summary>
        /// Parametros de la forma [valor1, valor2, ...]
        /// </summary>
        public object[] Parameters { get; set; }

        /// <summary>
        /// Indica si es un getter o setter
        /// </summary>
        public bool IsGetSet { get; set; }
    }

}