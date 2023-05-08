using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace MENHIR.Controls
{
    public class HybridWebView : WebView
    {
        private Dictionary<string, object> Instances = new Dictionary<string, object>();

        public void AddInstance(string key, object value)
        {
            this.Instances.Add(key, value);
        }

        public void Cleanup()
        {
            this.Instances.Clear();
        }

        public async void InvokeAction(string parameters)
        {
            bool error = false;
            object data = null;
            string ID = string.Empty;

            try
            {
                Entity entity = JsonSerializer.Deserialize<Entity>(parameters);
                ID = entity.ID;
                object instance = this.Instances[entity.Name];

                Type type = instance.GetType();

                object[] parametros = new object[entity.Parameters.Length];

                for (int i = 0; i < parametros.Length; i++)
                    parametros[i] = JsonElementToValue((JsonElement)entity.Parameters[i]);
                
                object resultTask = type.InvokeMember(entity.MethodName, BindingFlags.InvokeMethod, null, instance, parametros);
                await (Task)resultTask;
                var result = resultTask.GetType().GetProperty("Result").GetValue(resultTask, null);
                data = result;
            }
            catch (Exception ex)
            {
                data = ex.Message;
                error = true;
            }

            if (MainThread.IsMainThread)
                await ExecuteJS(ID, error, data);
            else
                MainThread.BeginInvokeOnMainThread(async () => { await ExecuteJS(ID, error, data); });
        }

        private async Task ExecuteJS(string ID, bool error, object data)
        {
            await this.EvaluateJavaScriptAsync($"window['-_-'].Post('{ID}', {error.ToString().ToLower()}, {JsonSerializer.Serialize(data)})");
        }

        private object JsonElementToValue(JsonElement item)
        {
            switch (item.ValueKind)
            {
                case JsonValueKind.Null:
                case JsonValueKind.Undefined:
                    return null;

                case JsonValueKind.Number:

                    if (Math.Abs(item.GetDouble() % 1) <= (Double.Epsilon * 100))
                        return item.GetInt32();

                    return item.GetDouble();

                case JsonValueKind.True:
                case JsonValueKind.False:
                    return item.GetBoolean();

                case JsonValueKind.Array:
                    int length = item.GetArrayLength();
                    var temp = new object[length];

                    for (int i = 0; i < length; i++)
                        temp[i] = JsonElementToValue(item[i]);

                    return temp;

                case JsonValueKind.Object:
                    var temp3 = JsonSerializer.Deserialize<Dictionary<string, object>>(item.GetString());
                    var temp4 = new Dictionary<string, object>();

                    foreach (var item1 in temp3)
                        temp4[item1.Key] = JsonElementToValue((JsonElement)item1.Value);
                    
                    return temp4;

                default:
                    return item.GetString();
            }
        }

    }

    internal class Entity
    {
        /// <summary>
        /// ID de la promesa
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// Nombre de la instancia del objeto
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Nombre del metodo a invocar
        /// </summary>
        public string MethodName { get; set; }

        /// <summary>
        /// Parametros de la forma ["tipo1", valor1, "tipo2", valor2, ...]
        /// </summary>
        public object[] Parameters { get; set; }
    }
}
