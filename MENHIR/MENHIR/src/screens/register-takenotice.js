export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const Options = {
        BackPage: MH.Routes.RegisterGive,
        NextPage: MH.Routes.Welcome,
        Name: 'Take Notice'
    }

    await (await import('./register-wellbeing.js')).Constructor(MH, root, Options);
}