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
     * @type {HTMLInputElement}
     */
    Password2: null,
    /**
     * @type {HTMLSelectElement}
     */
    Age: null,
    /**
     * @type {HTMLSelectElement}
     */
    Genders: null,
    /**
     * @type {HTMLInputElement}
     */
    Phrase: null,
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

    //Setear los campos, por si se a recargado o echado para atras
    Controls.Username.value = User.Username;
    Controls.Password.value = User.Password;
    //Controls.Password2.value = User.Password;
    MH.Utils.SelectOptionByValue(Controls.Age, User.Age);
    MH.Utils.SelectOptionByValue(Controls.Genders, User.IDGender);
    Controls.Phrase.value = User.Phrase;

    Controls.Password.oninput();
    Controls.Password2.oninput();
    Controls.Phrase.oninput();

    //#region Eventos Back y Next buttons

    // Volver a SingIn
    BackButton.onclick = e => {
        User.Clear();
        MH.GoTo(MH.Routes.SignIn);
    }

    let NextButtonlock = false;

    NextButton.onclick = async e => {

        if(NextButtonlock)
            return;

        NextButtonlock = true;

        //#region Comprobaciones

        // Comprobar que el Username no está vacio
        if(User.Username.trim() < 1){
            Controls.Username.focus();
            await MsgWarning.Show('Username can not be void');
            NextButtonlock = false;
            return;
        }

        // Comprobar que el Username está disponible

        let sql = 
        `
            SELECT 1
            FROM Users
            WHERE Username = @Username
        `;

        let parameters = {
            Username: User.Username
        }

        await MH.SQLite.Open();
        let response = await MH.SQLite.ExecuteEscalar(sql, parameters);
        await MH.SQLite.Close();

        if(response != null){
            Controls.Username.focus();
            await MsgWarning.Show('Username already exists');
            NextButtonlock = false;
            return;
        }

        // Comprobar el password

        if(User.Password.trim().length < 1 || User.Password.length < 7){
            Controls.Password.focus();
            await MsgWarning.Show('Password must contains minimum 7 characters');
            NextButtonlock = false;
            return;
        }

        if(Controls.Password.value != Controls.Password2.value){
            Controls.Password2.focus();
            await MsgWarning.Show('Please repeat your password');
            NextButtonlock = false;
            return;
        }

        // Comprobar edad

        if(User.Age < 18){
            Controls.Age.focus();
            await MsgWarning.Show('Please select your age');
            NextButtonlock = false;
            return;
        }


        // Comprobar genero

        if(User.IDGender < 1){
            Controls.Genders.focus();
            await MsgWarning.Show('Please select your gender');
            NextButtonlock = false;
            return;
        }

        // Comprobar frase de recuperación

        if(User.Phrase.trim().length < 7){
            Controls.Phrase.focus();
            await MsgWarning.Show('Please write a phrase');
            NextButtonlock = false;
            return;
        }

        //#endregion

        MH.GoTo(MH.Routes.RegisterConnect);
    }

    //#endregion

    BackButton.Show();
    NextButton.Show();

}



/**
 * Se inicializa los controles en orden en que aparecen en el html
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function InitControls(MH, root){
    const User = MH.User;
    const GoodColor = '#4cdf4a';
    const WrongColor = '#ff6060'

    Controls.Username.oninput = function(){
        User.Username = this.value;
    }

    Controls.Password.oninput = function(){
        if(this.value === '')
            this.style.backgroundColor = '';
        else if(this.value.length > 6)
            this.style.backgroundColor = GoodColor;
        else
            this.style.backgroundColor = WrongColor;

        User.Password = this.value;
        Controls.Password2.oninput();
    }

    Controls.Password2.oninput = function(){
        if(this.value === '')
            this.style.backgroundColor = '';
        else if(this.value === Controls.Password.value)
            this.style.backgroundColor = GoodColor;
        else
            this.style.backgroundColor = WrongColor;
    }

    //#region ComboBox de Edad

    Controls.Age.onchange = function(){
        User.Age = MH.Utils.GetSelectedOption(this).value;
    }

    let option = MH.Utils.AddOptionElement(Controls.Age, 'Select a option', 0);
    option.selected = true;
    option.disabled = true;

    for (let i = 18; i < 100; i++)
        MH.Utils.AddOptionElement(Controls.Age, i);

    //#endregion

    //#region ComboBox de Genero

    Controls.Genders.onchange = function(){
        User.IDGender = MH.Utils.GetSelectedOption(this).value;
    }

    option = MH.Utils.AddOptionElement(Controls.Genders, 'Select a option', 0);
    option.selected = true;
    option.disabled = true;

    await MH.SQLite.Open();
    /**
     * @type { {ID: Number, Name: String}[] }
     */
    const response = await MH.SQLite.ExecuteData('SELECT ID, Name FROM Genders ORDER BY ID ASC');
    await MH.SQLite.Close();

    for (let i = 0; i < response.length; i++) {
        const gender = response[i];
        MH.Utils.AddOptionElement(Controls.Genders, gender.Name, gender.ID);
    }

    //#endregion

    Controls.Phrase.oninput = function(){
        if(this.value === '')
            this.style.backgroundColor = '';
        else if(this.value.length > 6)
            this.style.backgroundColor = GoodColor;
        else
            this.style.backgroundColor = WrongColor;

        User.Phrase = this.value;
    }
}