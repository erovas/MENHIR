export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const Options = {
        BackPage: MH.Routes.RegisterBeActive,
        NextPage: MH.Routes.RegisterGive,
        Name: 'Keep Learning'
    }

    await (await import('./register-wellbeing.js')).Constructor(MH, root, Options);
}