using System;
using System.Linq;
using System.Reflection;

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

    }
}
