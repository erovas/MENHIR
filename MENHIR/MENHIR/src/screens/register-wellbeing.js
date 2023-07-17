export { Constructor }

/**
 * @type {Number[]}
 */
let Hobbies = [];

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {{BackPage: {}, NextPage: {}, Name: String}} options 
 */
async function Constructor(MH, root, options){

    Hobbies = MH.User['Hobbies' + options.Name.replaceAll(' ', '')];

    await InitControls(MH, root, options.Name);
    await SetControls(MH, root, options.Name);

    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const checkboxes = root.querySelectorAll('input[type="checkbox"]');

    // Checkear los checkboxes que habian sido marcados
    for (let i = 0; i < Hobbies.length; i++) {
        const hobby = Hobbies[i];
        let found = false;
        for (let j = 0; j < checkboxes.length; j++) {
            const input = checkboxes[j];
            if(input.value == hobby){
                input.checked = true;
                found = true;
                break;
            }
        }

        if(found)
            continue;

        // Caso que solo podria darse durante debuggin/desarrollo
        // Quiere decir que el hobby ya no existe en base de datos, se debe de borrar del SessionArray
        const index = Hobbies.indexOf(hobby);

        if(index > -1)
            Hobbies.slice(index, 1);
    }

    BackButton.onclick = e => {
        MH.GoTo(options.BackPage);
    }

    NextButton.onclick = e => {

        if(Hobbies.length < 1)
            return MsgWarning.Show('Please select a hobby');

        MH.GoTo(options.NextPage);
    }

    BackButton.Show();
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {String} name
 */
async function InitControls(MH, root, name){

    root.querySelector('#HobbyTitle').innerText = name;

    root.style.transition = '0.6s';
    //root.style.transitionDuration = '2000ms';
    //root.style.transitionProperty = 'background-color';

    //setTimeout(() => {
        root.style.backgroundColor = `var(--color-${name.replaceAll(' ', '').toLowerCase()})`;
    //}, 400);

}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {String} name
 */
async function SetControls(MH, root, name){

    const doc = MH.Document;
    const form = root.querySelector('form');
    const gap = root.querySelector('#gap');

    const response = await MH.Utils.GetAllHobbies(name);

    for (let i = 0; i < response.length; i++) {
        const hobby = response[i];
        const div = doc.createElement('div');
        const input = doc.createElement('input');
        const label = doc.createElement('label');

        input.value = hobby.ID;
        input.id = 'id' + input.value;
        input.type = 'checkbox';
        label.setAttribute('for', 'id' + input.value);
        label.innerText = hobby.Name;
        div.appendChild(input);
        div.appendChild(label);
        form.insertBefore(div, gap);
        //form.append(div);
        input.onchange = OnChange;
    }
}

function OnChange(){
    /**
     * @type {HTMLInputElement}
     */
    const that = this;
    const value = parseInt(that.value);

    if(that.checked)
        return Hobbies.push(value);

    const index = Hobbies.indexOf(value);

    if(index < 0)
        return;

    Hobbies.splice(index, 1);
}