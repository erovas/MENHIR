const Controls = {
    /**
     * @type {HTMLInputElement}
     */
    Username: null,

    /**
     * @type {HTMLInputElement}
     */
    Phrase: null,

    /**
     * @type {HTMLElement}
     */
    Validate: null,

    /**
     * @type {HTMLElement}
     */
    Result: null,

    /**
     * @type {HTMLElement}
     */
    Password: null
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

    Controls.Validate.onclick = async e => {
        await Validate(MH, MsgWarning);
    }

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.SignIn);
    }

    BackButton.Show();
}

let lockValidate = false;

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {import('../js/TypesDef.js').MsgBox} MsgWarning 
 * @returns 
 */
async function Validate(MH, MsgWarning){
    if(lockValidate)
        return;

    lockValidate = true;

    if(Controls.Username.value.trim().length < 1){
        await MsgWarning.Show('Write your username');
        lockValidate = false;
        return;
    }

    if(Controls.Phrase.value.trim().length < 1){
        await MsgWarning.Show('Write your phrase');
        lockValidate = false;
        return;
    }

    const sql = 
    `
    SELECT Password
    FROM Users
    WHERE UPPER(Phrase) = UPPER(@Phrase)
    `;

    const parameters = {
        Phrase: Controls.Phrase.value
    }

    await MH.SQLite.Open();
    const password = await MH.SQLite.ExecuteEscalar(sql, parameters);
    await MH.SQLite.Close();

    if(password == null){
        await MsgWarning.Show('Incorrect username or phrase');
        lockValidate = false;
        return;
    }

    Controls.Password.innerText = password;
    Controls.Result.className = 'show-result';
}