export { Constructor }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgInfo = MH.Components.MsgInfo;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    try {
        //Evitar guardar Story duplicada cuando se hace debugging/desarrollo
        // Guardar la Story si ya ha seleccionado un Mood inicial
        if(Story.ID < 1 && Story.IDMoodBefore != null){
            // Guardar la Story
            await MH.Utils.InsertStory(Story);    
            MsgInfo.Show('Story saved succesfully');
        }
    } catch (error) {
        MH.Xam.ShowError(error);
    }

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.AnotherAction);
    }

    NextButton.onclick = e => {
        MH.Xam.Close();
    }

    setTimeout(() => {
        NextButton.onclick();    
    }, 5000);

    //BackButton.Show();  //Quitar/comentar en release
    NextButton.Show();
}