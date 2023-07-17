export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){

    const options = {
        MoodTime: 'IDMoodBefore',
        AnswerTime: 'IDAnswerBefore',
        NextPage: MH.Routes.Action,
        BackPage: MH.Routes.MoodBefore
    }

    await (await import('./mood-answer.js')).Constructor(MH, root, options)
    
}