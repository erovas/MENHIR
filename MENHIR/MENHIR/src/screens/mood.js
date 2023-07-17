export { Constructor }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {{Title: String, MoodTime: String}} options
 */
async function Constructor(MH, root, options){
    
    root.querySelector('#Title').innerHTML = options.Title;
    const MoodTime = options.MoodTime;

    await InitControls(MH, root, MoodTime);

    const User = MH.User;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    if(Story[MoodTime] != null && Story[MoodTime] > 0){
        const inputs = root.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if(input.value == Story[MoodTime]){
                input.checked = true;
                break;
            }
        }
    }

    BackButton.Show();
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {String} MoodTime
 */
async function InitControls(MH, root, MoodTime){
    const User = MH.User;
    const document = MH.Document;
    const container = root.querySelector('#container');
    const cssVars = MH.Window.getComputedStyle(document.querySelector(':root'));

    const sql = 
    `
        SELECT 
            ID,
            Name
        FROM Moods
        ORDER BY ID DESC
    `;

    await MH.SQLite.Open();
    /**
     * @type {{ID: Number, Name: String}[]}
     */
    const response = await MH.SQLite.ExecuteData(sql);
    await MH.SQLite.Close();

    const OnChange = function(){
        if(!this.checked)
            return;

        User.Story[MoodTime] = this.value;
    }

    for (let i = 0; i < response.length; i++) {
        const mood = response[i];

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = mood.Name;
        input.value = mood.ID;
        input.name = 'mood';
        input.onchange = OnChange;

        const label = document.createElement('label');

        label.setAttribute('for', mood.Name);

        const spanImg = document.createElement('span');
        spanImg.innerText = cssVars.getPropertyValue(`--mood-${mood.Name.toLowerCase()}`);

        const spanTxt = document.createElement('span');
        spanTxt.innerText = mood.Name;

        label.append(spanImg, spanTxt);

        container.append(input, label);
    }
}