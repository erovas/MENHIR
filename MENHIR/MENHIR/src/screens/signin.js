const Controls = {
    /**
     * @type {HTMLInputElement}
     */
    Username: null,
    /**
     * @type {HTMLInputElement}
     */
    Password: null,
    /**
     * @type {HTMLElement}
     */
    SingIn: null,
    /**
     * @type {HTMLElement}
     */
    Forgot: null,
    /**
     * @type {HTMLElement}
     */
    Register: null

}

export { Constructor, Controls }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;

    Controls.Username.value = User.Username;
    Controls.Password.value = User.Password;

    User.Clear();

    User.Username = Controls.Username.value;
    User.Password = Controls.Password.value;

    BackButton.onclick = e => {
        MH.Components.ExitAlert.Show();
    }

    Controls.Username.oninput = function() {
        User.Username = this.value;
    }

    Controls.Password.oninput = function() {
        User.Password = this.value;
    }

    let singinLock = false;
    Controls.SingIn.onclick = NextButton.onclick = async e => {
        
        if(singinLock)
            return;

        singinLock = true;

        const granted = await DoSingIn(MH, root);

        singinLock = false;

        if(granted)
            return;
        
        await MsgWarning.Show('Wrong username or password');
    }

    Controls.Forgot.onclick = e => {
        User.Clear();
        MH.GoTo(MH.Routes.Forgot);
    }

    Controls.Register.onclick = e => {
        User.Clear();
        MH.GoTo(MH.Routes.Register);
    }

    BackButton.Show();
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @returns {Promise<boolean>}
 */
async function DoSingIn(MH, root){
    const User = MH.User;

    let sql = 
    `
        SELECT 1
        FROM Users
        WHERE Username = @Username
        AND Password = @Password
    `;

    let parameters = {
        Username: Controls.Username.value,
        Password: Controls.Password.value
    }

    
    await MH.SQLite.Open();
    let response = await MH.SQLite.ExecuteEscalar(sql, parameters);
    await MH.SQLite.Close();

    if(response == null)
        return false;

    User.Username = Controls.Username.value;
    User.Password = Controls.Password.value;

    await MH.Utils.PopulatetUser(User);

    MH.GoTo(MH.Routes.Welcome);
    return true;
}