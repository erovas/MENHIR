/**
 * @param {import('./TypesDef').Xam} Xam 
 * @param {import('./TypesDef').SQLiteConnectionAsync} SQLite 
 * @param {import('./TypesDef').DeviceHandler} DeviceHandler 
 */
export default async function(Xam, SQLite, DeviceHandler){
    
    const filePath = await SQLite.get_DatabasePath();

    console.log(filePath)

    // Borrar base de datos - Comentar/Quitar para release
    //await DeviceHandler.DeleteFile(filePath);

    const ddbbExists = await DeviceHandler.FileExists(filePath);

    // La base de datos ya existe, por tanto ya no se debe de crear
    if(ddbbExists)
        return;

    const created = (await Xam.ReadTextFile('../sql/01-CreateDataBase.sql')).split(';');
    const populate = (await Xam.ReadTextFile('../sql/02-PopulateDataBase.sql')).split(';');

    // Cuando se ejecuta el Open(), se crea el archivo
    await SQLite.Open();

    for (let i = 0; i < created.length; i++) {
        const sql = created[i];
        await SQLite.ExecuteNonQuery(sql);
        console.log(sql);
    }

    for (let i = 0; i < populate.length; i++) {
        const sql = populate[i];
        await SQLite.ExecuteNonQuery(sql);
        console.log(sql);
    }

    await SQLite.Close();
}