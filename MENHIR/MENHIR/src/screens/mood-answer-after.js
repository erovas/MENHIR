export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){

    const options = {
        MoodTime: 'IDMoodAfter',
        AnswerTime: 'IDAnswerAfter',
        NextPage: MH.Routes.Suggestion,
        BackPage: MH.Routes.MoodAfter
    }

    await (await import('./mood-answer.js')).Constructor(MH, root, options)
    
    MH.Components.BackButton.Hide();
}