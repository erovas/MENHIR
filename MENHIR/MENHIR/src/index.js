'use strict';

/**
 * 
 * @param {Window} window 
 * @param {Document} document 
 */
Xam.onload = async (window, document) => {

    //#region Objetos Nativos

    /**
     * @type {import('./js/TypesDef.js').Xam}
     */
    const Xam = window.Xam;
    //await Xam.OpenDevTools();
    
    /**
     * @type {import('./js/TypesDef.js').DeviceHandler}
     */
    const DeviceHandler = await Xam.new('DeviceHandler');

    /**
     * @type {import('./js/TypesDef.js').SQLiteConnectionAsync}
     */
    const SQLite = await Xam.new('SQLiteConnectionAsync', Xam.CurrentDirectory + '/ddbb.db3');

    /**
     * @type {import('./js/TypesDef.js').DevicePermissions}
     */
    const DevicePermissionsAsync = await Xam.new('DevicePermissionsAsync');

    /**
     * @type {import('./js/TypesDef.js').AudioRecorder}
     */
    const AudioRecorder = await Xam.new('AudioRecorderAsync');

    //#endregion
    
    //#region Components
    
    /**
     * @type {import('./js/TypesDef.js').LoadingScreen}
     */
    const LoadingScreen = document.querySelector('loading-screen');

    /**
     * @type {import('./js/TypesDef.js').ExitAlert}
     */
    const ExitAlert = document.getElementById('ExitAlert');

    /**
     * @type {import('./js/TypesDef.js').ExitAlert}
     */
    const LogOutAlert = document.getElementById('LogOutAlert');

    /**
     * @type {import('./js/TypesDef.js').SimpleSlider}
     */
    const SimpleSlider = document.querySelector('simple-slider');

    /**
     * @type {import('./js/TypesDef.js').ArrowButton}
     */
    const BackButton = document.getElementById('backbutton');
    /**
     * @type {import('./js/TypesDef.js').ArrowButton}
     */
    const NextButton = document.getElementById('nextbutton');

    /**
     * @type {import('./js/TypesDef.js').MsgBox}
     */
    const MsgWarning = document.getElementById('msg-warning');
    /**
     * @type {import('./js/TypesDef.js').MsgBox}
     */
    const MsgInfo = document.getElementById('msg-info');
    /**
     * @type {import('./js/TypesDef.js').MsgBox}
     */
    const MsgError = document.getElementById('msg-error');

    /**
     *  @type {import('./js/TypesDef.js').NotifyOne}
     */
    const NotifyOne = document.getElementById('NotifyOne');
    NotifyOne.Text = 'Did you try any of our suggestions?';

    /**
     *  @type {import('./js/TypesDef.js').NotifyTwo}
     */
    const NotifyTwo = document.getElementById('NotifyTwo');
    NotifyTwo.Text = 'Did you feel better?';

    const Components = {
        get SimpleSlider(){
            return SimpleSlider;
        },
        get LoadingScreen(){
            return LoadingScreen;
        },
        get BackButton(){
            return BackButton;
        },
        get NextButton(){
            return NextButton;
        },
        get ExitAlert(){
            return ExitAlert;
        },
        get LogOutAlert(){
            return LogOutAlert;
        },
        get MsgError(){
            return MsgError;
        },
        get MsgWarning(){
            return MsgWarning;
        },
        get MsgInfo(){
            return MsgInfo;
        },
        get NotifyOne(){
            return NotifyOne;
        },
        get NotifyTwo(){
            return NotifyTwo;
        }
    }

    //#endregion

    //#region Utils

    const Utils = (await import('./js/Utils.js')).default(SQLite);

    //#endregion

    //#region User

    const User = new (await import('./js/Classes.js')).User();

    //#endregion

    //#region 

    const UserNotification = new (await import('./js/Classes.js')).UserNotification();

    //#endregion

    //#region MENHIR

    const Routes = (await import('./Routes.js')).Routes;

    /**
     * 
     * @param {import('./js/TypesDef.js').Route | String} route 
     */
    const GoTo = route => {
        let hash = '#';

        if(typeof route == 'string')
            hash += route;
        else if(Utils.IsPlainObject(route))
            hash += route.url;
        else
            throw '[route] is not a valid argument';

        let anchor = document.createElement('a');
        anchor.href = hash;
        anchor.click();
        anchor = null;
    }

    /**
     * @type {import('./js/TypesDef.js').StoryType}
     */
    const StoryType = {
        Text: 1,
        Audio: 2,
        Review: 3,
        Nothing: 4
    }

    const MENHIR = {
        get User(){
            return User;
        },
        get UserNotification(){
            return UserNotification;
        },
        get SQLite(){
            return SQLite;
        },
        get DeviceHandler(){
            return DeviceHandler;
        },
        get DevicePermissions(){
            return DevicePermissionsAsync;
        },
        get AudioRecorder(){
            return AudioRecorder;
        },
        get Components(){
            return Components;
        },
        get Routes(){
            return Routes;
        },
        get StoryType(){
            return StoryType;
        },
        get Xam(){
            return Xam;
        },
        get Utils(){
            return Utils;
        },
        get Window(){
            return window;
        },
        get Document(){
            return document;
        },
        get GoTo(){
            return GoTo;
        }
    };

    Object.defineProperty(window, 'MENHIR',{
        get(){
            return MENHIR;
        }
    });

    //#endregion

    //#region Procesamiento de Ruteo

    let CurrentControls = [];
    let BackupCurrentControls = [];

    /**
     * 
     * @param {{url: String, html: String, load: String}} route 
     */
    const ExecuteRoute = async route => {
        BackButton.onclick = null;
        NextButton.onclick = null;

        BackButton.Hide();
        await NextButton.Hide();

        if(SimpleSlider.Count < 1)
            SimpleSlider.AddSlide().innerHTML = '<div></div>';

        //Devolver los controles de la screen a quitar a la normalidad
        for (let i = 0; i < CurrentControls.length; i++) {
            const currentControl = CurrentControls[i];
            const backupControl = BackupCurrentControls[i];
            
            for (const key in currentControl)
                if (Object.hasOwnProperty.call(currentControl, key))
                    currentControl[key] = backupControl[key];
        }
        
        CurrentControls.length = 0;
        BackupCurrentControls.length = 0;

        const slide = SimpleSlider.AddSlide();

        let root = document.createElement('div');
        root.className = 'hide';
        
        root.innerHTML = await Xam.ReadTextFile(route.html);
        slide.append(root);

        (SimpleSlider.Slides[0]).firstChild.className = 'delete';

        await Utils.DelayAsync(100);
        
        let response;

        try {
            response = await import(route.load);
        } catch (error) {
            throw error + "    qewerwwrwr";
        }
        

        for (const key in response) {

            if (!Object.hasOwnProperty.call(response, key))
                continue;
            
            const obj = response[key];
                
            if(!Utils.IsPlainObject(obj))
                continue;

            CurrentControls.push(obj);
            BackupCurrentControls.push(Utils.ClonePlainObject({}, obj));

            for (const innerKey in obj)
                if (Object.hasOwnProperty.call(obj, innerKey)){
                    let selector = obj[innerKey];
                    
                    if(typeof selector != 'string')
                        selector = '#' + innerKey

                    obj[innerKey] = root.querySelector(selector);
                }
        }

        if(typeof response.Constructor == 'function')
            await response.Constructor(MENHIR, root);
        
        await SimpleSlider.NextSlide();
        SimpleSlider.RemoveSlide(0);
        root.className = 'show';

        
    }
    
    window.onhashchange = async e => {
        //file://.../index.html#/lorem-ipsum => /lorem-ipsum
        const hash = window.location.hash.substring(1) || '/';

        for (const key in Routes) {
            if (Object.hasOwnProperty.call(Routes, key)) {
                const obj = Routes[key];
                
                if(obj.url == hash)
                    return await ExecuteRoute(obj);
            }
        }

        for (const key in Routes) {
            if (Object.hasOwnProperty.call(Routes, key)) {
                const obj = Routes[key];
                
                if(obj.url == '*')
                    return await ExecuteRoute(obj);
            }
        }

        Xam.ShowError(`Route "${hash}" not found`);
    }

    //#endregion
    
    //#region Configuración Movil y App

    // Evitar que el movil entre en estado de reposo, por falta de actividad en la App
    await DeviceHandler.BlockSleepMode(true);
    // Evitar que la App cambie de orientación, cuando el usuario gire el telefono
    await DeviceHandler.LockOrientation('Portrait');
    // Configurar base de datos
    await (await import('./js/ConfigDataBase.js')).default(Xam, SQLite, DeviceHandler);

    //Evento de presionar boton Back de Android
    window.addEventListener("XamOnBackPressed", e => {
        //if(BackButton.onclick)
        //    BackButton.onclick();
        if(BackButton.className !== "hide")
            BackButton.onclick();
    });

    ExitAlert.Text = 'Do you want to leave the app?'

    ExitAlert.onclickYes = e => {
        //Xam.Close();
        ExitAlert.Hide();
        MENHIR.GoTo(MENHIR.Routes.Final);
    }

    ExitAlert.onclickNo = e => {
        ExitAlert.Hide();
    }

    LogOutAlert.Text = 'Do you want to log out?'

    LogOutAlert.onclickYes = async e => {
        // Hacer algo para "desloguear"
        MENHIR.GoTo(Routes.SignIn);
        await Utils.DelayAsync(300);
        LogOutAlert.Hide();
    }

    LogOutAlert.onclickNo = e => {
        LogOutAlert.Hide();
    }

    //#endregion

    //setTimeout(async () => {
    //LoadingScreen.Hide();    
    await window.onhashchange();
    await Utils.DelayAsync(400);
    LoadingScreen.Hide();
    //}, 0);

    window.addEventListener('XamOnNotification', async e => {
        const UserNotification = MENHIR.UserNotification;
        const NotifyOne = Components.NotifyOne;
        const NotifyTwo = Components.NotifyTwo;
        const MsgError = MENHIR.Components.MsgError;

        UserNotification.Clear();

        let userNotEntity = JSON.parse(e.data.args[0]);

        // Recuperar la entidad para saber si la notificación YA ha sido respondida
        try {
            userNotEntity = await MENHIR.Utils.GetUserNotificationEntity(userNotEntity.ID);    
        } catch (error) {
            MENHIR.Xam.ShowError(error);
            return;
        }
        
        console.log(userNotEntity);

        // La notificación ya ha sido respondida
        if(userNotEntity.DateResponse > 0)
            return;

        UserNotification.ID = userNotEntity.ID;
        UserNotification.IDUser = userNotEntity.IDUser;
        UserNotification.IDStory = userNotEntity.IDStory;
        UserNotification.TableName = userNotEntity.TableName;
        UserNotification.HobbiesIDs.clear();

        for (let index = 0; index < userNotEntity.HobbiesIDs.length; index++) 
            UserNotification.HobbiesIDs.push(userNotEntity.HobbiesIDs[index]);

        UserNotification.Date = userNotEntity.Date;
        UserNotification.DateResponse = userNotEntity.DateResponse;
        UserNotification.IDHobbyResponse = userNotEntity.IDHobbyResponse;
        UserNotification.FeelResponse = userNotEntity.FeelResponse;

        NotifyTwo.onclickYes = async function(){
            UserNotification.FeelResponse = 1;
            NotifyTwo.Hide();
            try {
                console.log(UserNotification.toJSON())
                await MENHIR.Utils.UpdateUserNotification(UserNotification);
            } catch (error) {
                MENHIR.Xam.ShowError(error);
            }
            
        }

        NotifyTwo.onclickNo = async function(){
            UserNotification.FeelResponse = 0;
            NotifyTwo.Hide();
            try {
                await MENHIR.Utils.UpdateUserNotification(UserNotification);
            } catch (error) {
                MENHIR.Xam.ShowError(error);
            }
            
        }

        NotifyOne.onClicked = async function(){
            UserNotification.IDHobbyResponse = NotifyOne.Selected;
            await NotifyOne.Hide();
            await NotifyTwo.Show();
        }

        try {
            const TextosValores = await MENHIR.Utils.GetTextosValoresSugerencias(MENHIR.UserNotification);

            for (let index = 0; index < TextosValores.length; index++) {
                const obj = TextosValores[index];
                TextosValores[index] = { texto: 'Yes, ' + obj.texto, valor: obj.valor };
            }

            TextosValores.push({texto: 'No', valor: 0});
    
            console.log(TextosValores);
            NotifyOne.Show(TextosValores);    
        } catch (error) {
            MENHIR.Xam.ShowError(error);
        }
        
    });

}//)(window, document);