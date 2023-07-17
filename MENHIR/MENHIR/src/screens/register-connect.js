export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const Options = {
        BackPage: MH.Routes.Register,
        NextPage: MH.Routes.RegisterBeActive,
        Name: 'Connect'
    }

    await (await import('./register-wellbeing.js')).Constructor(MH, root, Options);
}