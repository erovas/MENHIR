export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {{ MoodTime: String, AnswerTime: String, NextPage: any, BackPage: any}} options 
 */
async function Constructor(MH, root, options){
    const AnswerTime = options.AnswerTime;
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;
    const IDAnswer = Story[AnswerTime];

    const IDMood = Story[options.MoodTime];
    const IsBad = IDMood < 7;

    await InitControls(MH, root, options);

    if(IDAnswer != null && IDAnswer > 0){
        const inputs = root.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if(input.value == IDAnswer){
                input.checked = true;
                break;
            }
        }
    }

    BackButton.onclick = e => {
        MH.GoTo(options.BackPage);
    }

    NextButton.onclick = e => {

        if(Story[AnswerTime] == null || Story[AnswerTime] < 1 || (IsBad && Story[AnswerTime] > 5) || (!IsBad && Story[AnswerTime] < 6))
            return MsgWarning.Show('Please select a answer');

        MH.GoTo(options.NextPage);
    }

    //BackButton.Show();  // Quitar/comentar en release
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 * @param {{ MoodTime: String, AnswerTime: String, NextPage: any, BackPage: any}} options 
 */
async function InitControls(MH, root, options){
    const User = MH.User;
    const Story = User.Story;
    const document = MH.Document;
    const MoodName = root.querySelector('#Mood');
    const IDMood = Story[options.MoodTime];
    const IsBad = IDMood < 7;
    const form = root.querySelector('form');

    let sql =
    `
        SELECT Name
        FROM Moods
        WHERE ID = ${IDMood}
    `;
    
    // Obtener el nombre del mood para la pregunta "Why do you feel [mood name]?"

    await MH.SQLite.Open();
    MoodName.innerHTML = await MH.SQLite.ExecuteEscalar(sql);
    await MH.SQLite.Close();


    //Rellenar con las opciones de respuesta

    sql =
    `
        SELECT
            ID,
            Description
        FROM MoodAnswers
        WHERE Type = '${IsBad? 'bad' : 'good'}'
        ORDER BY ID ASC
    `;

    await MH.SQLite.Open();
    /**
     * @type {{ID: Number, Description: String}[]}
     */
    const response = await MH.SQLite.ExecuteData(sql);
    await MH.SQLite.Close();

    const OnChange = function(){
        if(!this.checked)
            return;

        Story[options.AnswerTime] = this.value;
    }

    for (let i = 0; i < response.length; i++) {
        const answer = response[i];
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = answer.ID;
        input.id = 'id' + input.value;
        input.onchange = OnChange;

        const label = document.createElement('label');
        label.innerText = answer.Description;
        label.setAttribute('for', input.id);

        const br = document.createElement('br');

        form.append(input, label, br);
    }

}
