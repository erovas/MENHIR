export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    
    const sql = 'SELECT Response FROM Accepted';
    
    await MH.SQLite.Open();
    const response = await MH.SQLite.ExecuteEscalar(sql);
    await MH.SQLite.Close();

    if(response == 1)
        return MH.GoTo(MH.Routes.SignIn);
    

    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const ExitAlert = MH.Components.ExitAlert;
    

    // Cerrar la App, porque el usuario NO ha aceptado
    BackButton.onclick = async e => {
        await ExitAlert.Show();
    }

    // El usuario ha aceptado
    NextButton.onclick = async e => {

        /*
        console.log(MH.Xam.CurrentExternalDirectory);

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
        //else if(StorageWriteStatus == 'Unknown')
        console.log("asdafafaf")
            StorageWriteStatus = await MH.DevicePermissions.Request("StorageWrite");

            console.log(StorageWriteStatus)

        isAndroid = (await MH.DeviceHandler.get_Information()).Platform == 'Android';

        if(isAndroid && StorageWriteStatus == 'Denied')
            StorageWriteStatus = await MH.DevicePermissions.Request("StorageWrite");

        if(StorageWriteStatus == 'Denied'){
            await MsgError.Show('Please allow use it Write Storage', time);
            return;
        }
            
        await MH.DeviceHandler.WriteFileText(MH.Xam.CurrentExternalDirectory + '/ASD.txt', 'texto cualquiera largo y sedoso')

        console.log(await MH.DeviceHandler.FileExists(MH.Xam.CurrentExternalDirectory + '/ASD.txt'))
        console.log(await MH.DeviceHandler.ReadFileText(MH.Xam.CurrentExternalDirectory + '/ASD.txt'))

        return;
        */

        const sql = 'UPDATE Accepted SET Response = 1';
        await MH.SQLite.Open();
        await MH.SQLite.ExecuteNonQuery(sql);
        await MH.SQLite.Close();        
        MH.GoTo(MH.Routes.SignIn);
    }

    BackButton.Show();
    NextButton.Show();

}