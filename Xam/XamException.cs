using System;

namespace Xam
{
    /// <summary>
    /// Exception lanzada por el desarrollador del plugin, son errores controlados
    /// </summary>
    public class XamException : Exception
    {
        public string Type { get; }

        public XamException(string message, string type) : base(message) 
        { 
            Type = type;
        }

        public XamException() { }

        public XamException(string message, Exception innerException, string type) : base(message, innerException) 
        {
            Type = type;
        }
    }
}
