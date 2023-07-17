using System;
using System.Threading.Tasks;
using Xamarin.Essentials;

namespace Xam.Plugins.DevicePermissions
{
    public class DevicePermissionsAsync : IDisposable
    {
        public bool Disposed { get; private set; }

        public DevicePermissionsAsync() 
        {
        }

        public async Task<string> CheckStatus(string permissionName)
        {
            AUX_ThrowDisposed();

            if (!Enum.TryParse(permissionName, out DevicePermissions devicePermissions)) 
                throw new Exception("Unknow permission [" + permissionName + "]");

            PermissionStatus status;

            switch (devicePermissions)
            {
                case DevicePermissions.CalendarRead:
                    status = await Permissions.CheckStatusAsync<Permissions.CalendarRead>();
                    break;
                case DevicePermissions.CalendarWrite:
                    status = await Permissions.CheckStatusAsync<Permissions.CalendarWrite>();
                    break;
                case DevicePermissions.Camera:
                    status = await Permissions.CheckStatusAsync<Permissions.Camera>();
                    break;
                case DevicePermissions.ContactsRead:
                    status = await Permissions.CheckStatusAsync<Permissions.ContactsRead>();
                    break;
                case DevicePermissions.ContactsWrite:
                    status = await Permissions.CheckStatusAsync<Permissions.ContactsWrite>();
                    break;
                case DevicePermissions.Flashlight:
                    status = await Permissions.CheckStatusAsync<Permissions.Flashlight>();
                    break;
                case DevicePermissions.LocationWhenInUse:
                    status = await Permissions.CheckStatusAsync<Permissions.LocationWhenInUse>();
                    break;
                case DevicePermissions.LocationAlways:
                    status = await Permissions.CheckStatusAsync<Permissions.LocationAlways>();
                    break;
                case DevicePermissions.Media:
                    status = await Permissions.CheckStatusAsync<Permissions.Media>();
                    break;
                case DevicePermissions.Microphone:
                    status = await Permissions.CheckStatusAsync<Permissions.Microphone>();
                    break;
                case DevicePermissions.Phone:
                    status = await Permissions.CheckStatusAsync<Permissions.Phone>();
                    break;
                case DevicePermissions.Photos:
                    status = await Permissions.CheckStatusAsync<Permissions.Photos>();
                    break;
                case DevicePermissions.Reminders:
                    status = await Permissions.CheckStatusAsync<Permissions.Reminders>();
                    break;
                case DevicePermissions.Sensors:
                    status = await Permissions.CheckStatusAsync<Permissions.Sensors>();
                    break;
                case DevicePermissions.Sms:
                    status = await Permissions.CheckStatusAsync<Permissions.Sms>();
                    break;
                case DevicePermissions.Speech:
                    status = await Permissions.CheckStatusAsync<Permissions.Speech>();
                    break;
                case DevicePermissions.StorageRead:
                    status = await Permissions.CheckStatusAsync<Permissions.StorageRead>();
                    break;
                case DevicePermissions.StorageWrite:
                    status = await Permissions.CheckStatusAsync<Permissions.StorageWrite>();
                    break;
                default:
                    throw CreateException("Unknow permission [" + permissionName + "]");
            }

            return status.ToString();
        }

        public async Task<string> Request(string permissionName)
        {
            AUX_ThrowDisposed();

            if (!Enum.TryParse(permissionName, out DevicePermissions devicePermissions))
                throw CreateException("Unknow permission [" + permissionName + "]");

            PermissionStatus status;

            switch (devicePermissions)
            {
                case DevicePermissions.CalendarRead:
                    status = await Permissions.RequestAsync<Permissions.CalendarRead>();
                    break;
                case DevicePermissions.CalendarWrite:
                    status = await Permissions.RequestAsync<Permissions.CalendarWrite>();
                    break;
                case DevicePermissions.Camera:
                    status = await Permissions.RequestAsync<Permissions.Camera>();
                    break;
                case DevicePermissions.ContactsRead:
                    status = await Permissions.RequestAsync<Permissions.ContactsRead>();
                    break;
                case DevicePermissions.ContactsWrite:
                    status = await Permissions.RequestAsync<Permissions.ContactsWrite>();
                    break;
                case DevicePermissions.Flashlight:
                    status = await Permissions.RequestAsync<Permissions.Flashlight>();
                    break;
                case DevicePermissions.LocationWhenInUse:
                    status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                    break;
                case DevicePermissions.LocationAlways:
                    status = await Permissions.RequestAsync<Permissions.LocationAlways>();
                    break;
                case DevicePermissions.Media:
                    status = await Permissions.RequestAsync<Permissions.Media>();
                    break;
                case DevicePermissions.Microphone:
                    status = await Permissions.RequestAsync<Permissions.Microphone>();
                    break;
                case DevicePermissions.Phone:
                    status = await Permissions.RequestAsync<Permissions.Phone>();
                    break;
                case DevicePermissions.Photos:
                    status = await Permissions.RequestAsync<Permissions.Photos>();
                    break;
                case DevicePermissions.Reminders:
                    status = await Permissions.RequestAsync<Permissions.Reminders>();
                    break;
                case DevicePermissions.Sensors:
                    status = await Permissions.RequestAsync<Permissions.Sensors>();
                    break;
                case DevicePermissions.Sms:
                    status = await Permissions.RequestAsync<Permissions.Sms>();
                    break;
                case DevicePermissions.Speech:
                    status = await Permissions.RequestAsync<Permissions.Speech>();
                    break;
                case DevicePermissions.StorageRead:
                    status = await Permissions.RequestAsync<Permissions.StorageRead>();
                    break;
                case DevicePermissions.StorageWrite:
                    status = await Permissions.RequestAsync<Permissions.StorageWrite>();
                    break;
                default:
                    throw CreateException("Unknow permission [" + permissionName + "]");
            }

            return status.ToString();
        }

        public Task<bool> ShouldShowRationale(string permissionName)
        {
            AUX_ThrowDisposed();

            if (!Enum.TryParse(permissionName, out DevicePermissions devicePermissions))
                throw CreateException("Unknow permission [" + permissionName + "]");

            bool status;

            return Task.Factory.StartNew(delegate
            {

                switch (devicePermissions)
                {
                    case DevicePermissions.CalendarRead:
                        status = Permissions.ShouldShowRationale<Permissions.CalendarRead>();
                        break;
                    case DevicePermissions.CalendarWrite:
                        status = Permissions.ShouldShowRationale<Permissions.CalendarWrite>();
                        break;
                    case DevicePermissions.Camera:
                        status = Permissions.ShouldShowRationale<Permissions.Camera>();
                        break;
                    case DevicePermissions.ContactsRead:
                        status = Permissions.ShouldShowRationale<Permissions.ContactsRead>();
                        break;
                    case DevicePermissions.ContactsWrite:
                        status = Permissions.ShouldShowRationale<Permissions.ContactsWrite>();
                        break;
                    case DevicePermissions.Flashlight:
                        status = Permissions.ShouldShowRationale<Permissions.Flashlight>();
                        break;
                    case DevicePermissions.LocationWhenInUse:
                        status = Permissions.ShouldShowRationale<Permissions.LocationWhenInUse>();
                        break;
                    case DevicePermissions.LocationAlways:
                        status = Permissions.ShouldShowRationale<Permissions.LocationAlways>();
                        break;
                    case DevicePermissions.Media:
                        status = Permissions.ShouldShowRationale<Permissions.Media>();
                        break;
                    case DevicePermissions.Microphone:
                        status = Permissions.ShouldShowRationale<Permissions.Microphone>();
                        break;
                    case DevicePermissions.Phone:
                        status = Permissions.ShouldShowRationale<Permissions.Phone>();
                        break;
                    case DevicePermissions.Photos:
                        status = Permissions.ShouldShowRationale<Permissions.Photos>();
                        break;
                    case DevicePermissions.Reminders:
                        status = Permissions.ShouldShowRationale<Permissions.Reminders>();
                        break;
                    case DevicePermissions.Sensors:
                        status = Permissions.ShouldShowRationale<Permissions.Sensors>();
                        break;
                    case DevicePermissions.Sms:
                        status = Permissions.ShouldShowRationale<Permissions.Sms>();
                        break;
                    case DevicePermissions.Speech:
                        status = Permissions.ShouldShowRationale<Permissions.Speech>();
                        break;
                    case DevicePermissions.StorageRead:
                        status = Permissions.ShouldShowRationale<Permissions.StorageRead>();
                        break;
                    case DevicePermissions.StorageWrite:
                        status = Permissions.ShouldShowRationale<Permissions.StorageWrite>();
                        break;
                    default:
                        throw CreateException("Unknow permission [" + permissionName + "]");
                }

                return status;

            });
        }


        public void Dispose()
        {
            this.Disposed = true;
        }

        private void AUX_ThrowDisposed()
        {
            if(this.Disposed)
                throw CreateException(this.GetType().Name);
        }

        private static XamException CreateException(string message)
        {
            return new XamException(message, "Device Permission");
        }
    }

    internal enum DevicePermissions 
    {
        CalendarRead = 0,
        CalendarWrite = 1,
        Camera = 2,
        ContactsRead = 3,
        ContactsWrite = 4,
        Flashlight = 5,
        LocationWhenInUse = 6,
        LocationAlways = 7,
        Media = 8,
        Microphone = 9,
        Phone = 10,
        Photos = 11,
        Reminders = 12,
        Sensors = 13,
        Sms = 14,
        Speech = 15,
        StorageRead = 16,
        StorageWrite = 17
    }
}
