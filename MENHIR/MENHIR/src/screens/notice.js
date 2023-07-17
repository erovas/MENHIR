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
        const sql = 'UPDATE Accepted SET Response = 1';
        await MH.SQLite.Open();
        await MH.SQLite.ExecuteNonQuery(sql);
        await MH.SQLite.Close();        
        MH.GoTo(MH.Routes.SignIn);
    }

    BackButton.Show();
    NextButton.Show();

}