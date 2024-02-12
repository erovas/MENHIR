using Plugin.DeviceOrientation;
using Plugin.DeviceOrientation.Abstractions;
using System;
using System.IO;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace Xam.Plugins.Device
{
    public class DeviceHandler : IDisposable
    {
        private ISleepMode _SleepMode;
        private IToastMsg _TostMsg;

        #region PUBLIC PROPERTIES

        public bool Disposed { get; private set; }

        public Information _Information;
        public Information Information { 
            get
            {
                AUX_ThrowDisposed();
                return _Information;
            } 
        }

        public bool SupportOrientation
        {
            get
            {
                AUX_ThrowDisposed();
                return CrossDeviceOrientation.IsSupported;
            }
        }

        public string CurrentOrientation
        {
            get
            {
                if (!this.SupportOrientation)
                    return "Undefined";

                return CrossDeviceOrientation.Current.CurrentOrientation.ToString();
            }
        }

        #endregion

        public DeviceHandler() 
        {
            this._Information = new Information(
                                        DeviceInfo.Model,
                                        DeviceInfo.Name,
                                        DeviceInfo.Manufacturer,
                                        DeviceInfo.VersionString,
                                        DeviceInfo.Platform.ToString(),
                                        DeviceInfo.Idiom.ToString(),
                                        DeviceInfo.DeviceType.ToString()
                                );

            this._SleepMode = DependencyService.Get<ISleepMode>();
            this._TostMsg = DependencyService.Get<IToastMsg>();
        }

        public void LockOrientation(string orientation) 
        {
            if (!this.SupportOrientation)
                return;

            if (!Enum.TryParse(orientation, out DeviceOrientations result))
                throw new Exception("Unknow orientation [" + orientation + "]");

            CrossDeviceOrientation.Current.LockOrientation(result);
        }

        public void UnlockOrientation() 
        {
            if (!this.SupportOrientation)
                return;

            CrossDeviceOrientation.Current.UnlockOrientation();
        }

        public void BlockSleepMode(bool sleepMode)
        {
            AUX_ThrowDisposed();
            this._SleepMode.BlockSleepMode(sleepMode);
        }

        public void ShowToastMsg(string msg, string duration)
        {
            duration = (duration + "").ToUpper();
            msg = msg ?? "";

            if(duration == "LONG")
                this._TostMsg.LongAlert(msg);
            else
                this._TostMsg.ShortAlert(msg);
        }

        public bool FileExists(string filePath)
        {
            return File.Exists(filePath);
        }

        public void DeleteFile(string filePath)
        {
            File.Delete(filePath);
        }

        public string ReadFileText(string filePath)
        {
            return File.ReadAllText(filePath);
        }

        public void WriteFileText(string filePath, string text)
        {
            try
            {
                File.WriteAllText(filePath, text);
            }
            catch (IOException ex)
            {
                throw new XamException(ex.Message, ex, "Plugin method");
            }
            
        }

        public void Dispose()
        {
            BlockSleepMode(false);
            UnlockOrientation();
            this.Disposed = true;
            this._Information = null;
            this._SleepMode = null;
        }

        private void AUX_ThrowDisposed()
        {
            if (this.Disposed)
                throw new ObjectDisposedException(this.GetType().Name);
        }
    }
}
