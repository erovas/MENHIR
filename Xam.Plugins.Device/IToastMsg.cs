// https://stackoverflow.com/a/44126899
namespace Xam.Plugins.Device
{
    public interface IToastMsg
    {
        void LongAlert(string message);
        void ShortAlert(string message);
    }
}