export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.MoodAnswerAfter);
    }

    NextButton.onclick = e => {
        MH.GoTo(MH.Routes.AnotherAction);
    }

    //BackButton.Show();  //Quitar en Release

    setTimeout(() => {
        NextButton.Show();
    }, 1500);

    setTimeout(() => {
        NextButton.onclick()
    }, 2500);
}