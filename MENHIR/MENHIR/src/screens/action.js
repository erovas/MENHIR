export { Constructor }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const ExitAlert = MH.Components.ExitAlert;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;
    const radios = root.querySelectorAll('input');
    const StoryTypes = MH.StoryType;

    const OnChange = function(){
        if(!this.checked)
            return;

        Story.IDStoryType = this.value;
    }

    for (let i = 0; i < radios.length; i++){
        const input = radios[i];
        input.onchange = OnChange;
        
        if(input.value == Story.IDStoryType)
            input.checked = true;
    }

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.MoodAnswerBefore);
    }

    

    NextButton.onclick = e => {

        if(Story.IDStoryType < 1)
            return MsgWarning.Show('Please select an action');

        switch (Story.IDStoryType) {
            case StoryTypes.Text:
                return MH.GoTo(MH.Routes.WriteFeelings);

            case StoryTypes.Audio:
                return MH.GoTo(MH.Routes.RecordAudio);
        
            case StoryTypes.Review:
                return MH.GoTo(MH.Routes.Review);

            case StoryTypes.Nothing:
                return ExitAlert.Show();
        }
    }

    //BackButton.Show();  // Quitar/Comentar en release
    NextButton.Show();
}