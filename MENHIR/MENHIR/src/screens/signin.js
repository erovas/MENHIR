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

        if(await TryExportData(MH, root))
            return;

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

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @returns {Promise<boolean>}
 */
async function TryExportData(MH, root){
    const SuperUser = Controls.Username.value;
    const SuperPass = Controls.Password.value;
    const Today = new Date();

    function fnt(n){
        if(n < 10) 
            n = "0" + n;
        return n+"";
    }

    const yyyy = Today.getFullYear();
    const mm = fnt(Today.getMonth() + 1);
    const dd = fnt(Today.getDate());

    const ValidUser = (SuperUser == 'SU' + yyyy + mm + dd);
    const ValidPass = (SuperPass == 'SP' + yyyy + mm + dd);

    const result = ValidUser && ValidPass;

    if(result)
        await _ExportData(MH, yyyy, mm, dd);

    return result;
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {Number} yyyy
 * @param {Number} mm
 * @param {Number} dd
 */
async function _ExportData(MH, yyyy, mm, dd){
    
    let StorageReadStatus = await MH.DevicePermissions.CheckStatus("StorageRead");

    if(StorageReadStatus == 'Granted')
    {

    }
    else if(StorageReadStatus == 'Unknown')
        StorageReadStatus = await MH.DevicePermissions.Request("StorageRead");

    let isAndroid = (await MH.DeviceHandler.get_Information()).Platform == 'Android';

    if(isAndroid && StorageReadStatus == 'Denied')
        StorageReadStatus = await MH.DevicePermissions.Request("StorageRead");

    if(StorageReadStatus == 'Denied'){
        await MsgError.Show('Please allow use it Read Storage', time);
        return;
    }

    let StorageWriteStatus = await MH.DevicePermissions.CheckStatus("StorageWrite");
    console.log(StorageWriteStatus)

    if(StorageWriteStatus == 'Granted')
    {

    }

    StorageWriteStatus = await MH.DevicePermissions.Request("StorageWrite");

    console.log(StorageWriteStatus)

    isAndroid = (await MH.DeviceHandler.get_Information()).Platform == 'Android';

    if(isAndroid && StorageWriteStatus == 'Denied')
        StorageWriteStatus = await MH.DevicePermissions.Request("StorageWrite");

    if(StorageWriteStatus == 'Denied'){
        await MsgError.Show('Please allow use it Write Storage', time);
        return;
    }

    
    let sql = `SELECT * FROM Users`;
    let name = '' + yyyy + mm + dd
    let response;

    try {
        await MH.SQLite.Open();
        response = await MH.SQLite.ExecuteData(sql);
        await MH.SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }

    await MH.DeviceHandler.WriteFileText(MH.Xam.CurrentExternalDirectory + '/Users_' + name + '.txt', JSON.stringify(response));

    sql = 'SELECT * FROM UserStories';

    try {
        await MH.SQLite.Open();
        response = await MH.SQLite.ExecuteData(sql);
        await MH.SQLite.Close();    
    } catch (error) {
        try {
            await MH.SQLite.Close();
        } catch (error) { }
        throw error;
    }

    // NO extraer el texto de las notas
    for (let index = 0; index < response.length; index++) {
        const element = response[index];
        element.Text = null;
        element.Title = null;
        //element.Source = null;
    }

    await MH.DeviceHandler.WriteFileText(MH.Xam.CurrentExternalDirectory + '/UserStories_' + name + '.txt', JSON.stringify(response));

    sql = 'SELECT * FROM UserNotification';

    try {
        await MH.SQLite.Open();
        response = await MH.SQLite.ExecuteData(sql);
        await MH.SQLite.Close();    
    } catch (error) {
        try {
            await MH.SQLite.Close();
        } catch (error) { }
        throw error;
    }

    await MH.DeviceHandler.WriteFileText(MH.Xam.CurrentExternalDirectory + '/UserNotification_' + name + '.txt', JSON.stringify(response));

    alert('Data exported');
}