(async (window, document) => {
    const EXPORT_XAM = 'Xam'

    // Por si acaso, evitar "duplicidad" durante recarga del documento
    if (window[EXPORT_XAM]) {
        // Por si se ha recargado el documento, las referencias a los objetos nativos quedan en el limbo
        // desecharlas y asi evitar fugas de memoria RAM
        //await window[EXPORT_XAM].CleanUp();
        return;
    }

    const WVI = '--UID--';
    const CD = '-CD-';
    const CED = '-CED-';
    const Stringify = JSON.stringify;
    const CLASSES = Object.create(null);
    let devToolsInitiated = false;
    const ShowError = error => {

        if (devToolsInitiated)
            return console.error(error);

        let msgError;

        if (error == null || error == undefined)
            msgError = 'null';
        else if (typeof error === 'string')
            msgError = error;
        else if (error.stack)
            msgError = error.message + '\n' + error.stack;
        else if (error.message)
            msgError = error.message;
        else if(Array.isArray(error))
            msgError = error.join('\n');
        else
            try {
                msgError = Stringify(error);
            } catch (e) {
                msgError = error + '';
            }

        alert(msgError);
    };
    const LoadScript = src => {
        return new Promise((resolve, reject) => {
            let scriptTag = document.createElement('script');
            scriptTag.async = false;
            scriptTag.src = src;
            scriptTag.onload = _ => resolve();
            scriptTag.onerror = _ => reject(_.error);
    
            document.head.appendChild(scriptTag);
        });
    };

    //Lo utiliza internamente Xamarin para comunicarse con JS
    const WV = {
        Id: 0,
        Handlers: {},
        NativeEvents: {},
        Send: function (UID, Method = null, Parameters = [], IsGetSet = false) {
            return new Promise((resolve, reject) => {

                if (this.Id >= Number.MAX_SAFE_INTEGER)
                    this.Id = 0;

                if (!Array.isArray(Parameters))
                    Parameters = [Parameters];

                const handle = 'm' + this.Id++;
                this.Handlers[handle] = { resolve, reject, error: new Error('prueba') };
                const data = Stringify({ ID: handle, UID, Method, Parameters, IsGetSet });
                /*Bridge*/
                //window.webkit.messageHandlers.invokeAction.postMessage(data);
            });
        },
        Post: function (ID, error, data) {

            // Recuperar los manejadores
            const Handlers = this.Handlers[ID];

            // Eliminar los manejadores del diccionario
            delete this.Handlers[ID];

            if (error) {
                //Recuperar las trazas
                const stack = Handlers.error.stack.split('\n');
                // Eliminar algunas lineas que no aportan nada
                stack.splice(0, 5);
                // Unit todo el texto
                data += stack.join('\n');
                // En consola para movil es mas facil leer un array
                data = data.split('\n');
                
                const objResult = Object.create(null);
                objResult.error = 'C#';
                objResult.stack = data;

                Handlers.reject(objResult);
                return;
            }

            Handlers.resolve(data);
        },
        FireEvent: function (name, error, data) {

            if (error)
                return ShowError(data);

            name = EXPORT_XAM + name;

            const event = this.NativeEvents[name];

            if (!event)
                return ShowError("Native event ['" + name + "'] not found");

            event.data = data;
            window.dispatchEvent(event);
        }
    };

    /**
     * Para crear instancias de objetos nativos (plugins)
     * @param {String} name nombre del plugin para crear la instancia
     * @param  {...any} args Parametros que se le pasan al contructor del plugin
     * @returns 
     */
    const New = async (name, ...args) => {
        const UID = await WV.Send('-CI-', name, args);
        return new CLASSES[name](UID);
    }

    /**
     * Hace Dispose de todas las instancias de objetos nativos C#
     * @returns {Promise<void>}
     */
    const CleanUp = async () => await WV.Send('-CU-');

    /**
     * Hace Dispose de una unica instancia, mediante su identificador unico (UID)
     * @param {String} uid Identificador unico de la instancia
     * @returns {Promise<void>}
     */
    const CleanInstance = async (uid) => await WV.Send('-CU-', uid);

    /**
     * Hace un reload (F5) del documento
     * @returns {Promise<void>}
     */
    const Reload = async () => await WV.Send('-RE-');

    /**
     * Cierra la App
     * @returns {Promise<void>}
     */
    const Close = async () => await WV.Send('-CLOSE-');


    /**
     * Permite leer el texto de los archivos del movil
     * @param {URL} url 
     * @returns {Promise<String>}
     */
    const ReadTextFile = async (url) => {

        console.log((new Request(url).url))

        if (window.location.protocol.includes('http'))
            return await (await window.fetch(url)).text();

        url = url.replaceAll('../', '');
        console.log(url)
        let index = url.indexOf('./');
        console.log(url)
        if(index < 0)
            url = './' + url;
        console.log(url)
        const rq = new Request(url);
        console.log(rq.url);
        console.log(XAM.CurrentDirectory);
        const newUrl = rq.url.replace('file://', '');
        console.log(newUrl);
        return await WV.Send('-RTF-', newUrl);
    }

    const ReadTextFile2 = url => {
        console.log(url);
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = e => {
                console.log(xhr);
                console.log(xhr.responseText);
            }
            xhr.onloadend = e => {
                let xhrStatus = xhr.status;
                console.log("end");
                console.log(xhr.status);
                console.log(xhr);
                console.log(xhr.responseText);
                resolve(xhr.responseText);
                //respuesta satisfactoria (200 a 299) ó cache (304)
                if ((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304)
                    resolve(xhr.responseText);
                else
                    reject({ url, xhrStatus, statusText: xhr.statusText });
            }
            xhr.onerror = e => {
                console.log(e);
                console.log(xhr);
                reject(e);
            };
            
            xhr.send();
        });
    }

    const ReadFileBase64 = async (url) => {
        return await WV.Send('-RF64-', url);
    }

    /**
     * Abre la DevTools para debugging
     * https://github.com/liriliri/eruda
     * @param {URL} [url] url a script que implemente una devtools/consola para debugging
     * @returns 
     */
    const OpenDevTools = async (url) => {

        if (devToolsInitiated)
            return;
        
        await LoadScript(url || 'https://cdnjs.cloudflare.com/ajax/libs/eruda/3.0.0/eruda.min.js');
        
        if(window.eruda)
            window.eruda.init();

        devToolsInitiated = true;
    }

    /**
     * 
     * @param {String} title - Titulo de la notificación
     * @param {String} message - Mensaje de la notificación
     * @param {Date | null} notifyTime - Tiempo de espera para lanzar notificación
     * @param  {...any} [args] 
     */
    const SendNotification = async(title, message, notifyTime, ...args) => {
        
        if(notifyTime instanceof Date)
            notifyTime = notifyTime.getTime();
        else
            notifyTime = null;

        args.unshift(notifyTime);
        args.unshift(message);
        await WV.Send('-NTF-', title, args);
    }

    //Para exponer API en JS
    const XAM = {
        get new() {
            return New;
        },
        get CleanUp() {
            return CleanUp;
        },
        get CleanInstance() {
            return CleanInstance;
        },
        get Reload() {
            return Reload;
        },
        get Close() {
            return Close;
        },
        get OpenDevTools() {
            return OpenDevTools;
        },
        get ReadTextFile(){
            return ReadTextFile;
        },
        get ReadFileBase64(){
            return ReadFileBase64;
        },
        get SendNotification(){
            return SendNotification;
        },
        get LoadScript(){
            return LoadScript;
        },
        get ShowError(){
            return ShowError;
        },
        get CurrentDirectory() {
            return CD;
        },
        get CurrentExternalDirectory() {
            return CED;
        },
    };

    // Exposición de la API al desarrollador, como window.Xam
    Object.defineProperty(window, EXPORT_XAM, {
        get() {
            return XAM;
        }
    });

    // "Exposición" de la API para Xamarin
    Object.defineProperty(window, WVI, {
        get() {
            return WV;
        }
    });

    // Para exponer los eventos nativos Xamarin al desarrollador
    ['--events--'].forEach(item => {
        item = EXPORT_XAM + item
        WV.NativeEvents[item] = new window.CustomEvent(item);
    });

    // !! OJO, NO borrar este comentario
    /*Classes*/

    // Por si acaso
    await CleanUp();

    window.addEventListener('error', e => {
        ShowError(e.error);
        return true;
    });

    /*
    window.addEventListener("unhandledrejection", e => {
        if (e.error)
            ShowError(e.error);
        else
            ShowError(`UNHANDLED PROMISE REJECTION: ${e.reason}`);

        return true;
    });
    */
    
    // Asegurarse de que el body ya se ha creado
    let checkBodyReady = async () => {

        if (document.body) {
            checkBodyReady = null;
            await LoadScript('index.js');

            const NotificationData = sessionStorage.getItem(WVI);

            // No hay datos para lanzar "XamOnNotification"
            if(NotificationData == null)
                return;

            sessionStorage.removeItem(WVI);

            // Hay datos, por tanto se lanza el evento
            const data = JSON.parse(NotificationData);
            WV.FireEvent('OnNotification', false, data);

            return;
        }

        setTimeout(_ => checkBodyReady(), 10);
    }

    await checkBodyReady();

})(window, document);