/**
 * @typedef {Routes} Router
 */
const Routes = {
    /**
     * No encontrada
     */
    NotFound: {
        url: '*',
        html: './screens/404.html',
        load: './screens/404.js'
    },
    Notice: {
        url: '/',
        html: './screens/notice.html',
        load: './screens/notice.js'
    },
    SignIn: {
        url: '/signin',
        html: './screens/signin.html',
        load: './screens/signin.js'
    },
    Register: {
        url: '/register',
        html: './screens/register.html',
        load: './screens/register.js'
    },
    RegisterConnect: {
        url: '/register-connect',
        html: './screens/register-wellbeing.html',
        load: './screens/register-connect.js'
    },
    RegisterBeActive: {
        url: '/register-beactive',
        html: './screens/register-wellbeing.html',
        load: './screens/register-beactive.js'
    },
    RegisterKeepLearning: {
        url: '/register-keeplearning',
        html: './screens/register-wellbeing.html',
        load: './screens/register-keeplearning.js'
    },
    RegisterGive: {
        url: '/register-give',
        html: './screens/register-wellbeing.html',
        load: './screens/register-give.js'
    },
    RegisterTakeNotice: {
        url: '/register-takenotice',
        html: './screens/register-wellbeing.html',
        load: './screens/register-takenotice.js'
    },
    Forgot: {
        url: '/forgot',
        html: './screens/forgot.html',
        load: './screens/forgot.js'
    },
    Welcome: {
        url: '/welcome',
        html: './screens/welcome.html',
        load: './screens/welcome.js'
    },
    Crisis: {
        url: '/crisis',
        html: './screens/crisis.html',
        load: './screens/crisis.js'
    },


    MoodBefore: {
        url: '/mood-before',
        html: './screens/mood.html',
        load: './screens/mood-before.js'
    },
    MoodAnswerBefore: {
        url: '/mood-answer-before',
        html: './screens/mood-answer.html',
        load: './screens/mood-answer-before.js'
    },

    Action: {
        url: '/action',
        html: './screens/action.html',
        load: './screens/action.js'
    },

    WriteFeelings: {
        url: '/action/write',
        html: './screens/write-feelings.html',
        load: './screens/write-feelings.js'
    },
    RecordAudio: {
        url: '/action/record',
        html: './screens/record-audio.html',
        load: './screens/record-audio.js'
    },
    Review: {
        url: '/action/review',
        html: './screens/review.html',
        load: './screens/review.js'
    },
    
    MoodAfter: {
        url: '/mood-after',
        html: './screens/mood.html',
        load: './screens/mood-after.js'
    },
    MoodAnswerAfter: {
        url: '/mood-answer-after',
        html: './screens/mood-answer.html',
        load: './screens/mood-answer-after.js'
    },
    Suggestion: {
        url: '/suggestion',
        html: './screens/suggestion.html',
        load: './screens/suggestion.js'
    },

    GoodJob: {
        url: '/good-job',
        html: './screens/good-job.html',
        load: './screens/good-job.js'
    },

    AnotherAction: {
        url: '/another-action',
        html: './screens/another-action.html',
        load: './screens/another-action.js'
    },

    Final: {
        url: '/final',
        html: './screens/final.html',
        load: './screens/final.js'
    }
}


export { Routes };