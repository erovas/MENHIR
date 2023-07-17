using System;
using System.Collections.Generic;
using System.Text;

namespace Xam.Plugins.Device
{
    public class Information
    {
        public string Model { get; }
        public string Name { get; }
        public string Manufacturer { get; }
        public string Version { get; }

        /// <summary>
        /// "Android" || "iOS" || "macOS" || "tvOS" || "Tizen" || "UWP" || "watchOS" || "Unknown"
        /// </summary>
        public string Platform { get; }

        /// <summary>
        /// "Phone" || "Tablet" || "Desktop" || "TV" || "Watch" || "Unknown"
        /// </summary>
        public string Idiom { get; }

        /// <summary>
        /// "Unknown" || "Physical" || "Virtual"
        /// </summary>
        public string DeviceType { get; }

        public Information(string model, string name, string manufacturer, string version, string platform, string idiom, string deviceType)
        {
            Model = model;
            Name = name;
            Manufacturer = manufacturer;
            Version = version;
            Platform = platform;
            Idiom = idiom;
            DeviceType = deviceType;
        }   
    }
}