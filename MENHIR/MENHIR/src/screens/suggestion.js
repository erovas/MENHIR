const Controls = {
    /**
     * @type {HTMLUListElement}
     */
    List: null
}

export { Constructor, Controls }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;

    await MakeSuggestion(MH, root)

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.MoodAnswerAfter);
    }

    NextButton.onclick = e => {
        MH.GoTo(MH.Routes.AnotherAction);
    }

    //BackButton.Show();  //Quitar en Release

    setTimeout(() => {
        NextButton.Show();
    }, 2000);

    setTimeout(() => {
        //NextButton.onclick();
    }, 5500);
}

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function MakeSuggestion(MH, root){
    const User = MH.User;
    const Story = User.Story;
    const Wellbeings = ['Connect', 'BeActive', 'KeepLearning', 'Give', 'TakeNotice'];
    const HobbyName = Wellbeings[Story.IDAnswerAfter - 1];
    const HobbiesSelected = [];

    const HobbyTableName = 'Hobbies' + HobbyName;
    const HobbiesIDsSelected = [];

    /**
     * @type {Number[]} - HobbiesTakeNotice por ejemplo
     */
    const Hobbies = User[HobbyTableName];

    console.log(HobbyName);

    // Obtenemos todos los hobbies del wellbeing que ha answeriado en la pantalla anterior
    const HobbyEntities = await MH.Utils.GetAllHobbies(HobbyName);

    //Quitamos el ultimo hobby que es "Other"
    HobbyEntities.splice(HobbyEntities.length - 1, 1);

    console.log(HobbyEntities, Hobbies.length)

    // Elegimos algun hobby que el usuario ha seleccionado durante el registro del perfil
    let index = RandomInt(0, Hobbies.length);
    let IDHobby = Hobbies[index];

    console.log(IDHobby, HobbyName);

    // Quiere decir que el hobby elegido fue "Other"
    if(IDHobby == HobbyEntities.length)
        IDHobby -= 1;

    // Se agrega el hobby a la lista para desplegar
    HobbiesSelected.push(HobbyEntities[IDHobby].Name);

    HobbiesIDsSelected.push(HobbyEntities[IDHobby].ID);

    //Eliminamos del array de entidades todos los hobbies que el usuario tiene registrado en su perfil
    //Para quedarnos unicamente con aquello que NO tiene registrado en su perfil
    for (let i = 0; i < Hobbies.length; i++)
        HobbyEntities.splice(Hobbies[i], 1);
    
    // No creo que algun usuario seleccione todos los hobbies, pero capaz pase
    if(HobbyEntities.length > 0){

        // De los hobbies que NO tiene el usuario registrado en su perfil, seleccionamos uno
        index = RandomInt(0, HobbyEntities.length);

        // Se agrega a la lista para desplegar
        HobbiesSelected.push(HobbyEntities[index].Name);

        //HobbiesIDsSelected.push(index);
        HobbiesIDsSelected.push(HobbyEntities[index].ID);
    }
    
    // Rellenar la lista
    PopulateList(MH, HobbiesSelected);

    User.Story.Suggested = HobbyTableName + '-' + JSON.stringify(HobbiesIDsSelected);
}

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {string[]} hobbies
 */
function PopulateList(MH, hobbies){

    for (let i = 0; i < hobbies.length; i++) {
        const hobby = hobbies[i];
        const li = MH.Document.createElement('li');
        const h2 = MH.Document.createElement('h2');
        h2.innerText = hobby;
        li.append(h2);
        Controls.List.append(li);
    }
}

/**
 * Generate a random integer beetween min and (max - 1)
 * @param {Number} min 
 * @param {Number} max 
 * @returns 
 */
function RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min); 
}
  