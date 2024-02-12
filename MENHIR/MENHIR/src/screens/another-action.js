export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const MsgInfo = MH.Components.MsgInfo;
    const MsgError = MH.Components.MsgError;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;
    const UserNotification = MH.UserNotification;

    let LaunchNotification = false

    try {
        //Evitar guardar Story duplicada cuando se hace debugging/desarrollo
        if(Story.ID < 1){
            // Guardar la Story
            await MH.Utils.InsertStory(Story);    
            MsgInfo.Show('Story saved succesfully');

            LaunchNotification = true;
        }
    } catch (error) {
        MH.Xam.ShowError(error);
    }

    // Se ha sugerido alguna actividad, lanzar notificación para dentro de 2 días
    if(LaunchNotification && !!Story.Suggested) {
        try {
            const splitter = Story.Suggested.split('-');
            const TableName = splitter[0];
            const HobbiesIDs = JSON.parse(splitter[1])

            UserNotification.Clear();
            UserNotification.IDUser = User.ID;
            UserNotification.IDStory = Story.ID;
            UserNotification.TableName = TableName;
            UserNotification.HobbiesIDs.clear();

            for (let index = 0; index < HobbiesIDs.length; index++)
                UserNotification.HobbiesIDs.push(HobbiesIDs[index]);
            
            await MH.Utils.InsertUserNotification(UserNotification)
            MsgInfo.Show('UserNotication saved succesfully');

            const time = new Date();
            //time.setSeconds(time.getSeconds() + 20);    // 20 egundos
            //time.setDate(time.getDate() + 2);           // 2 Dias
            time.setMinutes(time.getMinutes() + 3);     //3 Minutos
            //time.setDate(time.getDate() + 1);           // 1 Dias
            await MH.Xam.SendNotification('Hi there!', 'Did you try any of our suggestions?', time, JSON.stringify(UserNotification));
        
        } catch (error) {
            MH.Xam.ShowError(error);
        }
    }
    

    // Para desarrollo/debugging
    BackButton.onclick = e => {

        // Viene de Review
        if(Story.IDMoodAfter == null)
            return MH.GoTo(MH.Routes.Review);
        
        if(Story.IDMoodAfter < 7)
            return MH.GoTo(MH.Routes.Suggestion);

        MH.GoTo(MH.Routes.GoodJob);
    }

    NextButton.onclick = e => {
        const input = MH.Utils.GetRadioInputChecked(root);

        if(input == null)
            return MsgWarning.Show('Please select a option');

        if(input.value == 'no')
            return MH.GoTo(MH.Routes.Final);
        
        //MH.GoTo(MH.Routes.MoodBefore);
        MH.GoTo(MH.Routes.Welcome);
    }

    //BackButton.Show();  //Quitar en release
    NextButton.Show();
}