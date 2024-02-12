using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace MENHIR.Utils
{
    public static class Misc
    {
        private const string BASECLASSJS = @"
            (_ => {
                _['/*n*/'] = class /*n*/ {
                    #i;
                    constructor(uid){this.#i = uid;}
                    get UID(){return this.#i;}
                    Dispose(){return WV.Send('-CU-', this.UID)}
                    /*m*/
                };
            })(CLASSES);
            ";

        public static string GenerateJSClass(Type type)
        {
            MethodInfo[] methods = type.GetMethods().Where(m => !m.IsSpecialName).ToArray();
            PropertyInfo[] props = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            
            string methodsJs = string.Empty;
            string propsJS = string.Empty;

            // Linkeado de metodos
            foreach (var item in methods)
                if(item.Name != "Dispose")
                    methodsJs += item.Name + "(...v){return WV.Send(this.#i,'" + item.Name + "',v)} ";

            // Linkeado de propiedades
            foreach (PropertyInfo prop in props)
            {
                string name = prop.Name;

                // Public Setters
                if (prop.CanWrite && prop.GetSetMethod() != null)
                    propsJS += "set_" + name + "(v){return WV.Send(this.#i,'" + name + "',v,true)} ";
                
                // Public Getters
                if (prop.CanRead && prop.GetGetMethod() != null)
                    propsJS += "get_" + name + "(){return WV.Send(this.#i,'" + name + "',[],true)} ";

            }

            string baseClassJs = BASECLASSJS.Replace("/*n*/", type.Name);
            baseClassJs = baseClassJs.Replace("/*m*/", propsJS + methodsJs);
            return baseClassJs;
        }

        public static object JsonElementToValue(JsonElement item)
        {
            switch (item.ValueKind)
            {
                case JsonValueKind.Null:
                case JsonValueKind.Undefined:
                    return null;

                case JsonValueKind.Number:

                    if (Math.Abs(item.GetDouble() % 1) <= (Double.Epsilon * 100))
                    {
                        if (item.TryGetInt32(out var value))
                            return value;

                        return item.GetInt64();
                    }

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
                    var temp3 = JsonSerializer.Deserialize<Dictionary<string, object>>(item.GetRawText());
                    var temp4 = new Dictionary<string, object>();

                    foreach (var item1 in temp3)
                    {
                        if (item1.Value is null)
                        {
                            temp4[item1.Key] = null;
                            continue;
                        }

                        temp4[item1.Key] = JsonElementToValue((JsonElement)item1.Value);
                    }

                    return temp4;

                default:
                    return item.GetString();
            }
        }

    }
}