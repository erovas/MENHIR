export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const MsgInfo = MH.Components.MsgInfo;
    const MsgError = MH.Components.MsgError;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    try {
        //Evitar guardar Story duplicada cuando se hace debugging/desarrollo
        if(Story.ID < 1){
            // Guardar la Story
            await MH.Utils.InsertStory(Story);    
            MsgInfo.Show('Story saved succesfully');
        }
    } catch (error) {
        MH.Xam.ShowError(error);
    }

    // Para desarrollo/debugging
    BackButton.onclick = e => {

        // Viene de Review
        if(Story.IDMoodAfter == null)
            return MH.GoTo(MH.Routes.Review);
        
        if(Story.IDMoodAfter < 7)
            return MH.GoTo(MH.Routes.Suggestion);

        MH.GoTo(MH.Routes.GoodJob);
    }

    NextButton.onclick = e => {
        const input = MH.Utils.GetRadioInputChecked(root);

        if(input == null)
            return MsgWarning.Show('Please select a option');

        if(input.value == 'no')
            return MH.GoTo(MH.Routes.Final);
        
        //MH.GoTo(MH.Routes.MoodBefore);
        MH.GoTo(MH.Routes.Welcome);
    }

    //BackButton.Show();  //Quitar en release
    NextButton.Show();
}