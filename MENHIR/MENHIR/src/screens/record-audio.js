const Controls = {
    /**
     * @type {HTMLElement}
     */
    BtnRecord: null,

    /**
     * @type {HTMLElement}
     */
    Record: null,

    /**
     * @type {HTMLElement}
     */
    StopRecord: null,

    /**
     * @type {import('../js/TypesDef.js').HTMLPlayerSoundElement}
     */
    Player: null,

    /**
     * @type {HTMLElement}
     */
    PlayerContainer: null,

    /**
     * @type {HTMLInputElement}
     */
    Title: null,
}

export { Constructor, Controls }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;
    
    // Es dificil predecir el estado de los objetos nativos, lo mejor obligar a grabar de nuevo
    Story.Source = null;

    await TryDeleteAudio(MH);

    const granted = await CheckPermission(MH, root);

    if(!granted)
        return MH.GoTo(MH.Routes.Action);

    Controls.Title.oninput = function() {
        Story.Title = this.value;
    }

    Controls.BtnRecord.onclick = async e => {

        // Está grabando
        if(Controls.Record.style.display == 'none'){
            Controls.Record.style.display = 'block';
            Controls.StopRecord.style.display = 'none';
            Controls.Player.src = await MH.AudioRecorder.Stop();
            Story.Source = await MH.AudioRecorder.get_FilePath();
            Controls.PlayerContainer.style.visibility = 'visible';
            console.log(Story.toJSON());
            return;
        }
        
        //Se está tratando de grabar de nuevo, borrar el audio anterior si lo hay
        await TryDeleteAudio(MH);

        // Va a grabar
        Story.Source = null;
        Controls.Record.style.display = 'none';
        Controls.StopRecord.style.display = 'block';
        await MH.AudioRecorder.Start();
        Controls.PlayerContainer.style.visibility = 'hidden';
    }

    BackButton.onclick = async e => {
        //Se va a ir para atras, borrar audio grabado si lo hay
        await TryDeleteAudio(MH);

        Story.Source = null;
        MH.GoTo(MH.Routes.Action);
    }

    NextButton.onclick = e => {

        if(Story.Title == null || Story.Title.trim().length < 1)
            return MsgWarning.Show('Please write a title');

        if(Story.Source == null || Story.Source.trim().length < 1)
            return MsgWarning.Show('Please record an audio');

        MH.GoTo(MH.Routes.MoodAfter);
    }

    //BackButton.Show();  // Comentar/quitar en release
    NextButton.Show();
}


/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @returns
 */
async function CheckPermission(MH, root){

    const MsgError = MH.Components.MsgError;
    const MsgInfo = MH.Components.MsgInfo;
    const time = 8000;

    let MicrophoneStatus = await MH.DevicePermissions.CheckStatus("Microphone");

    if(MicrophoneStatus == 'Granted')
        return true;

    if(MicrophoneStatus == 'Unknown')
        MicrophoneStatus = await MH.DevicePermissions.Request("Microphone");

    const isAndroid = (await MH.DeviceHandler.get_Information()).Platform == 'Android';

    if(isAndroid && MicrophoneStatus == 'Denied')
        MicrophoneStatus = await MH.DevicePermissions.Request("Microphone");

    if(MicrophoneStatus == 'Denied'){
        await MsgError.Show('Please allow use it Microphone', time);
        return false;
    }
        
    else if(MicrophoneStatus == 'Disabled'){
        await MsgError.Show('Please enable Microphone', time);
        return false;
    }
        
    else if(MicrophoneStatus == 'Restricted'){
        await MsgError.Show('Please unrestricted Microphone', time);
        return false;
    }
        
    await MsgInfo.Show('Microphone allowed');

    return true;
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 */
async function TryDeleteAudio(MH){
    try {
        await MH.AudioRecorder.Delete()
    } catch (error) {
        console.log(error);
    }
}

var Sound = (function () {
    var df = document.createDocumentFragment();
    return function Sound(src) {
      try {
        //src = 'file://' + src;
        console.log(src);
        var snd = new Audio(src);
        df.appendChild(snd); // keep in fragment until finished playing
        snd.addEventListener("ended", function () {
          df.removeChild(snd);
        });
        snd.onerror = function (e) {
          console.log(snd.error);
        };
        snd.play();
        //snd.duration  //Duracion del sonido en segundos

        
        return snd;
      } catch (error) {
        alert(error);
      }
    };
  })();


