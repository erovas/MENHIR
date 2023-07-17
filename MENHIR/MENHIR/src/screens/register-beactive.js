export { Constructor }

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const Options = {
        BackPage: MH.Routes.RegisterConnect,
        NextPage: MH.Routes.RegisterKeepLearning,
        Name: 'Be Active'
    }

    await (await import('./register-wellbeing.js')).Constructor(MH, root, Options);
}