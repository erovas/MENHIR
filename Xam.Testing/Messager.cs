using System;
using Xamarin.Forms;

namespace Xam.Testing
{
    public class Messager
    {
        private IMessage messager;

        public Messager()
        {
            this.messager = DependencyService.Get<IMessage>();
        }

        public void LongAlert(string message)
        {
            this.messager.LongAlert(message);
        }

        public void ShortAlert(string message)
        {
            this.messager.ShortAlert(message);
        }
    }
}
