const Controls = {
    /**
     * @type {HTMLSpanElement}
     */
    Username: null,
    /**
     * @type {HTMLInputElement}
     */
    PrevThoughts: null,
}

export { Constructor, Controls }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgInfo = MH.Components.MsgInfo;
    const LogOutAlert = MH.Components.LogOutAlert;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;

    Controls.Username.innerText = User.Username;

    if(User.ID < 1){
        await MH.Utils.InsertUser(User);
        await MsgInfo.Show('Successfully registered user!');
    }

    Controls.PrevThoughts.onclick = e => {
        MH.GoTo(MH.Routes.Review);
    }

    BackButton.onclick = e => {
        LogOutAlert.Show();
    }

    NextButton.onclick = e => {
        MH.GoTo(MH.Routes.MoodBefore);
    }

    BackButton.Show();
    NextButton.Show();
}