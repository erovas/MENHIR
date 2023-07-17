using System;
using System.Collections.Generic;
using System.Reflection;

namespace MENHIR.Utils
{
    /// <summary>
    /// Static utility class to get/set properties and/or fields via reflection
    /// <para>
    /// Copyright (c) 2023, Emanuel Rojas Vásquez - BSD 3-Clause License
    /// </para>
    /// <para>
    /// https://github.com/erovas
    /// </para>
    /// </summary>
    public static class Reflexion
    {
        private static readonly BindingFlags _PublicStaticFlag = BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy;
        private static readonly BindingFlags _PrivateStaticFlag = BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy;
        private static readonly BindingFlags _PublicFlag = BindingFlags.Public | BindingFlags.Instance;
        private static readonly BindingFlags _PrivateFlag = BindingFlags.NonPublic | BindingFlags.Instance;

        #region PROPERTIES

        public static object GetStaticPropertyValue(Type type, string propName, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (string.IsNullOrWhiteSpace(propName))
                throw new ArgumentNullException(nameof(propName));

            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;

            PropertyInfo property = type.GetProperty(propName, flag);
            return property?.GetValue(null);
        }

        public static object GetStaticPropertyValue(object obj, string propName, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return GetStaticPropertyValue(obj.GetType(), propName, isPrivate);
        }


        public static bool SetStaticPropertyValue(Type type, string propName, object value, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (string.IsNullOrWhiteSpace(propName))
                throw new ArgumentNullException(nameof(propName));

            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;
            PropertyInfo property = type.GetProperty(propName, flag);

            if (property != null)
            {
                try
                {
                    property.SetValue(null, value);
                }
                catch (Exception)
                {
                    try
                    {
                        MethodInfo method = property.SetMethod;
                        if (method == null)
                            return false;

                        method.Invoke(null, new object[] { value });
                    }
                    catch (Exception)
                    {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        public static bool SetStaticPropertyValue(object obj, string propName, object value, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return SetStaticPropertyValue(obj.GetType(), propName, value, isPrivate);
        }


        public static Dictionary<string, object> GetStaticPropertiesValues(Type type, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            var result = new Dictionary<string, object>();
            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;

            foreach (PropertyInfo property in type.GetProperties(flag))
                result.Add(property.Name, property.GetValue(null));

            return result;
        }

        public static Dictionary<string, object> GetStaticPropertiesValues(object obj, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return GetStaticPropertiesValues(obj.GetType(), isPrivate);
        }


        public static object GetPropertyValue(object obj, string propName, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            if (string.IsNullOrWhiteSpace(propName))
                throw new ArgumentNullException(nameof(propName));

            return _GetPropertyValue(obj.GetType(), obj, propName, isPrivate);
        }

        public static bool SetPropertyValue(object obj, string propName, object value, bool isPrivate)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            if (string.IsNullOrWhiteSpace(propName))
                throw new ArgumentNullException(nameof(propName));

            return _SetPropertyValue(obj.GetType(), obj, propName, value, isPrivate);
        }


        public static Dictionary<string, object> GetPropertiesValues(object obj, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var result = new Dictionary<string, object>();
            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;
            Type type = obj.GetType();

            while (type != null)
            {
                foreach (PropertyInfo property in type.GetProperties(flag))
                    if (!result.ContainsKey(property.Name))
                        result.Add(property.Name, property.GetValue(obj));

                type = type.BaseType;
            }

            return result;
        }

        #endregion

        #region FIELDS

        public static object GetStaticFieldValue(Type type, string fieldName, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (string.IsNullOrWhiteSpace(fieldName))
                throw new ArgumentNullException(nameof(fieldName));

            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;
            FieldInfo field = type.GetField(fieldName, flag);
            return field?.GetValue(null);
        }

        public static object GetStaticFieldValue(object obj, string fieldName, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return GetStaticFieldValue(obj.GetType(), fieldName, isPrivate);
        }


        public static bool SetStaticFieldValue(Type type, string fieldName, object value, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (string.IsNullOrWhiteSpace(fieldName))
                throw new ArgumentNullException(nameof(fieldName));

            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;
            FieldInfo field = type.GetField(fieldName, flag);

            if (field != null)
            {
                field.SetValue(null, value);
                return true;
            }

            return false;
        }

        public static bool SetStaticFieldValue(object obj, string propName, object value, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return SetStaticFieldValue(obj.GetType(), propName, value, isPrivate);
        }


        public static Dictionary<string, object> GetStaticFieldsValues(Type type, bool isPrivate = false)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            var result = new Dictionary<string, object>();
            BindingFlags flag = isPrivate ? _PrivateStaticFlag : _PublicStaticFlag;

            foreach (FieldInfo property in type.GetFields(flag))
                result.Add(property.Name, property.GetValue(null));

            return result;
        }

        public static Dictionary<string, object> GetStaticFieldsValues(object obj, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            return GetStaticFieldsValues(obj.GetType(), isPrivate);
        }



        public static object GetFieldValue(object obj, string fieldName, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            if (string.IsNullOrWhiteSpace(fieldName))
                throw new ArgumentNullException(nameof(fieldName));

            return _GetFieldValue(obj.GetType(), obj, fieldName, isPrivate);
        }

        public static bool SetFieldValue(object obj, string fieldName, object value, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            if (string.IsNullOrWhiteSpace(fieldName))
                throw new ArgumentNullException(nameof(fieldName));

            return _SetFieldValue(obj.GetType(), obj, fieldName, value, isPrivate);
        }


        public static Dictionary<string, object> GetFieldsValues(object obj, bool isPrivate = false)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var result = new Dictionary<string, object>();
            BindingFlags flag = isPrivate ? _PrivateFlag : _PublicFlag;
            Type type = obj.GetType();

            while (type != null)
            {
                foreach (FieldInfo property in type.GetFields(flag))
                    if (!result.ContainsKey(property.Name))
                        result.Add(property.Name, property.GetValue(obj));

                type = type.BaseType;
            }

            return result;
        }

        #endregion

        #region PRIVATE

        private static object _GetPropertyValue(Type type, object obj, string propName, bool isPrivate)
        {
            if (type == null)
                return null;

            BindingFlags flag = isPrivate ? _PrivateFlag : _PublicFlag;
            PropertyInfo property = type.GetProperty(propName, flag);
            return property != null ? property.GetValue(obj) : _GetPropertyValue(type.BaseType, obj, propName, isPrivate);
        }

        private static bool _SetPropertyValue(Type type, object obj, string propName, object value, bool isPrivate)
        {
            if (type == null)
                return false;

            BindingFlags flag = isPrivate ? _PrivateFlag : _PublicFlag;
            PropertyInfo property = type.GetProperty(propName, flag);

            if (property != null)
            {
                try
                {
                    property.SetValue(obj, value);
                }
                catch (Exception)
                {
                    try
                    {
                        MethodInfo method = property.SetMethod;
                        if (method == null)
                            return false;

                        method.Invoke(obj, new object[] { value });
                    }
                    catch (Exception)
                    {
                        return false;
                    }
                }

                return true;
            }

            return _SetPropertyValue(type.BaseType, obj, propName, value, isPrivate);
        }

        private static object _GetFieldValue(Type type, object obj, string fieldName, bool isPrivate)
        {
            if (type == null)
                return null;

            BindingFlags flag = isPrivate ? _PrivateFlag : _PublicFlag;
            FieldInfo property = type.GetField(fieldName, flag);
            return property != null ? property.GetValue(obj) : _GetFieldValue(type.BaseType, obj, fieldName, isPrivate);
        }

        private static bool _SetFieldValue(Type type, object obj, string fieldName, object value, bool isPrivate)
        {
            if (type == null)
                return false;

            BindingFlags flag = isPrivate ? _PrivateFlag : _PublicFlag;
            FieldInfo field = type.GetField(fieldName, flag);

            if (field != null)
            {
                field.SetValue(obj, value);
                return true;
            }

            return _SetFieldValue(type.BaseType, obj, fieldName, value, isPrivate);
        }

        #endregion

    }

}