const Controls = {
    /**
     * @type {HTMLInputElement}
     */
    StoryTitle: null,

    /**
     * @type {HTMLTextAreaElement}
     */
    StoryText: null
}

export { Constructor, Controls }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){

    await InitControls(MH, root);

    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    Controls.StoryTitle.value = Story.Title;
    Controls.StoryText.value = Story.Text;

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.Action);
    }

    NextButton.onclick = e => {

        if(Story.Title == null || Story.Title.trim().length < 1)
            return MsgWarning.Show('Please write a name');

        if(Story.Text == null || Story.Text.trim().length < 1)
            return MsgWarning.Show('Please write a content');

        MH.GoTo(MH.Routes.MoodAfter);
    }

    //BackButton.Show();    // Quitar/Comentar en release
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function InitControls(MH, root){
    const Story = MH.User.Story;

    Controls.StoryTitle.oninput = function(){
        Story.Title = this.value;
    }

    Controls.StoryText.oninput = function(){
        Story.Text = this.value;
    }

}