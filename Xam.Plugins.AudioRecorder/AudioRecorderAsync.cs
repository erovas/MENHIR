using Plugin.AudioRecorder;
using System;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;

namespace Xam.Plugins.AudioRecorder
{
    public class AudioRecorderAsync : IDisposable
    {
        public static bool IsHttp { get; set; }
        public static string RootPath { get; set; }

        private AudioRecorderService Recorder { get; set; }

        public string MyRootPath { get; }

        #region PUBLIC PROPERTIES

        public bool Disposed { get; private set; }

        public string FilePath
        {
            get
            {
                AUX_ThrowDisposed();
                return this.Recorder.FilePath;
            }
        }

        public bool IsRecording
        {
            get
            {
                AUX_ThrowDisposed();
                return this.Recorder.IsRecording;
            }
        }

        #endregion

        public AudioRecorderAsync()
        {
            this.Recorder = new AudioRecorderService()
            {
                StopRecordingAfterTimeout = false,
                StopRecordingOnSilence = false,
            };

            //RootPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            this.MyRootPath = RootPath;
        }

        public AudioRecorderAsync(string rootPath) : this()
        {
            MyRootPath = rootPath;
        }

        public async Task<bool> Start()
        {
            return await Start(null);
        }

        public async Task<bool> Start(string filename)
        {
            AUX_ThrowDisposed();

            //Ya se está grabando, NO hacer nada
            if (this.Recorder.IsRecording)
                return false;

            //Nombre por defecto del archivo a grabar
            if (string.IsNullOrWhiteSpace(filename))
                filename =  DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture).Replace("/", "-").Replace(":", "_");

            this.Recorder.FilePath = this.MyRootPath + "/" + filename + ".wav";

            await this.Recorder.StartRecording();
            return true;
        }

        /// <summary>
        /// Una vez detenida la grabación, devuelve un string,
        /// <para>
        /// Ruta del archivo guardado, si se esta en protocolo file://
        /// </para>
        /// Ó string base64 si se está en protocolo http://
        /// </summary>
        /// <returns></returns>
        public async Task<string> Stop()
        {
            AUX_ThrowDisposed();

            if (!this.Recorder.IsRecording)
                return null;

            await this.Recorder.StopRecording();

            if(IsHttp)
                return "data:audio/wav;base64," + AUX_GetBase64String();

            return this.Recorder.FilePath;
        }

        public Task Delete()
        {
            AUX_ThrowDisposed();
            return Task.Factory.StartNew(delegate
            {
                File.Delete(this.Recorder.FilePath);
                return;
            });
        }

        public Task<string> GetBase64String()
        {
            AUX_ThrowDisposed();
            return Task.Factory.StartNew(delegate
            {
                return AUX_GetBase64String();
            });
        }

        public void Dispose()
        {
            this.Recorder = null;
            this.Disposed = true;
        }

        private void AUX_ThrowDisposed()
        {
            if (this.Disposed)
                throw new ObjectDisposedException(this.GetType().Name);
        }

        private string AUX_GetBase64String()
        {
            Stream stream = this.Recorder.GetAudioFileStream();

            byte[] bytes;
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
            }

            string base64 = Convert.ToBase64String(bytes);
            return base64;
        }
    }

}