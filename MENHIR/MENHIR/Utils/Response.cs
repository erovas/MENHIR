using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

namespace MENHIR.Utils
{
    /// <summary>
    /// Simple object for query responses
    /// <para>
    /// Copyright (c) 2023, Emanuel Rojas Vásquez - BSD 3-Clause License
    /// </para>
    /// <para>
    /// https://github.com/erovas
    /// </para>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Response<T>
    {
        public static Response<T> Result(T value)
        {
            return new Response<T>(value);
        }

        public static Response<T> Error(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                throw new ArgumentNullException("An error Response must contain a message");

            return new Response<T>(new ErrorInfo(message));
        }

        public static Response<T> Error(Exception exception, string message = null)
        {
            return new Response<T>(new ErrorInfo(exception, message));
        }

        /// <summary>
        /// 
        /// </summary>
        public T Value { get; }

        /// <summary>
        /// 
        /// </summary>
        public bool Success { get; }

        /// <summary>
        /// 
        /// </summary>
        public ErrorInfo ErrorInfo { get; }

        private Response(T value)
        {
            this.Value = value;
            this.Success = true;
        }

        private Response(ErrorInfo errorInfo)
        {
            this.Value = default;
            this.Success = false;
            this.ErrorInfo = errorInfo;
        }

    }

    /// <summary>
    /// Error Information
    /// </summary>
    public class ErrorInfo
    {
        /// <summary>
        /// Developer or Exception message
        /// </summary>
        public string Message { get; }

        /// <summary>
        /// 
        /// </summary>
        public Trace[] StackTrace { get; }

        /// <summary>
        /// 
        /// </summary>
        public Exception Exception { get; }

        /// <summary>
        /// Creation DateTime UTC format
        /// </summary>
        public DateTime? Date { get; }

        internal ErrorInfo(Exception exception, string message = null)
        {
            this.Exception = exception;
            this.StackTrace = getStackTrace();

            if (message == null)
                this.Message = exception.Message;
            else
                this.Message = message;

            this.Date = DateTime.UtcNow;
        }

        internal ErrorInfo(string message)
        {
            this.Message = message;
            this.StackTrace = getStackTrace();
            this.Date = DateTime.UtcNow;
        }

        private Trace[] getStackTrace()
        {
            var traces = new List<Trace>();
            StackTrace st = new StackTrace(true);

            for (int i = 3; i < st.FrameCount; i++)
            {
                StackFrame sf = st.GetFrame(i);

                if (sf == null)
                    continue;

                var trace = new Trace(getMethodName(sf.GetMethod()), sf.GetFileLineNumber(), sf.GetFileName());
                traces.Add(trace);
            }

            return traces.ToArray();
        }

        private string getMethodName(MethodBase methodBase)
        {
            if (methodBase == null)
                return "Unknow";

            string modifier = string.Empty;

            if (methodBase.IsPublic)
                modifier = "public";
            else if (methodBase.IsPrivate)
                modifier = "private";
            else if (methodBase.IsAssembly)
                modifier = "internal";
            else if (methodBase.IsFamily)
                modifier = "protected";
            else if (methodBase.IsFamilyOrAssembly)
                modifier = "protected internal";
            else if (methodBase.IsFamilyAndAssembly)
                modifier = "private protected";

            modifier += " ";

            if (methodBase.IsStatic)
                modifier += "static ";

            try
            {
                Type info = ((MethodInfo)methodBase).ReturnType;

                if (info.FullName.StartsWith("System"))
                    modifier += info.Name.ToLower();
                else
                    modifier += info.FullName;

                modifier += " ";
            }
            catch (Exception)
            {

            }

            if (methodBase.IsConstructor)
                modifier += methodBase.DeclaringType.FullName + "(";

            else
            {
                string methodName = methodBase.Name;

                if (methodBase.IsSpecialName)
                {
                    if (methodName.StartsWith("get_"))
                        modifier += methodName.Substring(4) + " { get; }";
                    else
                        modifier += methodName.Substring(4) + " { set; }";

                    return modifier;
                }

                if (methodName.StartsWith("<Main"))
                    modifier += "Main";
                else
                    modifier += methodName;

                modifier += "(";
            }

            var parameters = methodBase.GetParameters();

            foreach (var par in parameters)
            {
                var paramType = par.ParameterType;

                if (paramType.FullName.Contains("System"))
                    modifier += paramType.Name.ToLower() + " " + par.Name;
                else
                    modifier += paramType.FullName + " " + par.Name;

                if (par.HasDefaultValue)
                {
                    object defaultvalue = par.DefaultValue;
                    modifier += " = " + (defaultvalue == null ? "null" : (String.IsNullOrWhiteSpace(defaultvalue + "") ? "\"" + defaultvalue + "\"" : defaultvalue.ToString()));
                }

                modifier += ", ";
            }

            //Quitar ", " final
            modifier = modifier.Substring(0, modifier.Length - 2);

            return modifier + ")";
        }

    }

    /// <summary>
    /// 
    /// </summary>
    public class Trace
    {
        /// <summary>
        /// Name of the method that generated the trace
        /// </summary>
        public string Method { get; }

        /// <summary>
        /// Number line that generated the trace
        /// </summary>
        public int Line { get; }

        /// <summary>
        /// Path of the file that generated the trace
        /// </summary>
        public string File { get; }


        internal Trace(string method, int line, string file)
        {
            this.Method = method;
            this.Line = line;
            this.File = string.IsNullOrEmpty(file) ? "not available in release mode!" : file;
        }
    }

}