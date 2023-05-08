using Plugin.AudioRecorder;
using System;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;

namespace Xam.Plugins.AudioRecorder
{
    public class AudioRecorder
    {
        private AudioRecorderService Recorder { get; set; }
        private string RootPath { get; }

        public AudioRecorder(string rootPath) 
        {
            this.Recorder = new AudioRecorderService()
            {
                StopRecordingAfterTimeout = false,
                StopRecordingOnSilence = false,
            };

            this.RootPath = rootPath;
        }

        public async Task Start(string filename = null)
        {
            if (this.Recorder.IsRecording)
                return;

            if (string.IsNullOrWhiteSpace(filename))
                filename =  DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture).Replace("/", "-").Replace(":", "_");

            this.Recorder.FilePath = this.RootPath + "/" + filename + ".wav";

            await this.Recorder.StartRecording();
            return;
        }

        public async Task<AudioRecorderResponse> Stop()
        {
            if (!this.Recorder.IsRecording)
                return null;

            await this.Recorder.StopRecording();
            return new AudioRecorderResponse(this.Recorder);
        }
    }

    public class AudioRecorderResponse
    {
        public string FilePath { get; }
        public Stream Stream { get; }

        public AudioRecorderResponse(AudioRecorderService recorder)
        {
            this.FilePath = recorder.GetAudioFilePath();
            this.Stream = recorder.GetAudioFileStream();
        }
    }

}
