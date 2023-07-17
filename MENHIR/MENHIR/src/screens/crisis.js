export { Constructor }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const ExitAlert = MH.Components.ExitAlert;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.MoodBefore);
    }

    NextButton.onclick = e => {
        ExitAlert.Show();
    }

    BackButton.Show();
    NextButton.Show();
}