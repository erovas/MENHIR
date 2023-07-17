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
        Title: 'How are you today?',
        MoodTime: 'IDMoodBefore'
    }

    const User = MH.User;
    const ExitAlert = MH.Components.ExitAlert;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    //Indica que se va hacer "Another action"
    const IsFinish = Story.ID > 0;

    if(IsFinish){
        Story.Clear();
        Story.IDUser = User.ID;
    }
        

    await (await import('./mood.js')).Constructor(MH, root, options);

    Controls.BtnDoSome.style.fontWeight = 'bolder';
    Controls.BtnDoSome.innerText = `I'm in crisis!`;
    Controls.BtnDoSome.className = 'btn-default';

    Controls.BtnDoSome.onclick = e => {
        MH.GoTo(MH.Routes.Crisis);
    }

    BackButton.onclick = e => {
        if(IsFinish)
            return ExitAlert.Show();

        MH.GoTo(MH.Routes.Welcome);
    }

    NextButton.onclick = e => {
        if(Story.IDMoodBefore == null || Story.IDMoodBefore < 1)
            return MsgWarning.Show('Please select a mood');

        MH.GoTo(MH.Routes.MoodAnswerBefore);
    }
    
}