// https://stackoverflow.com/a/44126899
namespace Xam.Testing
{
    public interface IMessage
    {
        void LongAlert(string message);
        void ShortAlert(string message);
    }
}