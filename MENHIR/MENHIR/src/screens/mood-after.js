const Controls = {
    /**
     * @type {HTMLSpanElement}
     */
    BtnDoSome: null,
}

export { Constructor, Controls }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){

    const options = {
        Title: 'How do you feel now?',
        MoodTime: 'IDMoodAfter'
    }

    const User = MH.User;
    const ExitAlert = MH.Components.ExitAlert;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;
    const StoryTypes = MH.StoryType;

    await (await import('./mood.js')).Constructor(MH, root, options);

    //Controls.BtnDoSome.style.fontWeight = 'bolder'
    //Controls.BtnDoSome.innerText = `I'm in crisis!`;
    //Controls.BtnDoSome.className = 'btn-default';
    //Controls.BtnDoSome.onclick = e => {
    //    MH.GoTo(MH.Routes.Crisis);
    //}
    Controls.BtnDoSome.style.height = "var(--banner-height)"

    BackButton.onclick = e => {
        switch (Story.IDStoryType) {
            case StoryTypes.Text:
                return MH.GoTo(MH.Routes.WriteFeelings);
        
            case StoryTypes.Audio:
                return MH.GoTo(MH.Routes.RecordAudio);

            case StoryTypes.Review:
                return MH.GoTo(MH.Routes.Review);
        }
    }

    NextButton.onclick = e => {
        if(Story.IDMoodAfter == null || Story.IDMoodAfter < 1)
            return MsgWarning.Show('Please select a mood');

        // Mood malo
        if(Story.IDMoodAfter < 7)
            return MH.GoTo(MH.Routes.MoodAnswerAfter);

        // Mood bueno
        MH.GoTo(MH.Routes.GoodJob);
    }
    
    BackButton.Hide();  // Descomentar/Agregar para debugging
}