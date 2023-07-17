// @ts-check

//#region Definición de Xam

/**
 * @typedef {object} NativeInstance 
 * @property {Readonly<string>} UID - Identificador unico de la instancia de un objeto nativo
 */

/**
 * @callback New 
 * @param {String} name Nombre de la clase nativa de la cual se quiere crear una instancia
 * @param  {...any} [args] Parametros que se le pasan al constructor de la clase nativa
 * @returns {Promise<NativeInstance>}
 */

/**
 * @typedef {object} Xam
 * @property {New} new - Llama al constructor de una clase nativa para crear una instancia.
 * @property {()=> Promise<String>} CleanUp - Limpia todas las instancias de los objetos nativos
 * @property {(UID: string) => Promise<String>} CleanInstance - Elimina una instancia de un objeto nativo mediante su identificador unico (NativeInstance.UID)
 * @property {() => Promise<void>} Reload - Ejecuta una recarga del documento (F5)
 * @property {() => Promise<void>} Close - Cierra la App
 * @property {(url: URL) => Promise<void>} OpenDevTools - Abre las herramientas de desarrollador
 * @property {(url: URL) => Promise<String>} ReadTextFile - Lee el texto de un archivo
 * @property {(url: URL) => Promise<String>} ReadFileBase64 - Lee un archivo como string base 64
 * @property {(url: URL) => Promise<void>} LoadScript - Carga un script
 * @property {(error: any) => Promise<void>} ShowError - Muestra en pantalla un mensaje de error.
 * @property {Readonly<string>} CurrentDirectory - Obtiene la ruta del directorio en donde se está ejecutando la aplicacion web
 */

//#endregion

//#region Definición SQLiteConnection y SQLiteConnectionAsync

/**
 * @callback ExecuteNonQuery 
 * @param {String} query Script sql a ejecutar
 * @param  {Object<string, Number | string | null>} [parameters] Bind variables para el Script sql
 * @returns {Promise<Number>}
 */

/**
 * @callback ExecuteEscalar 
 * @param {String} query Script sql a ejecutar (SELECT)
 * @param  {Object<string, Number | string | null>} [parameters] Bind variables para el Script sql
 * @returns {Promise<String | Number | null>}
 */

/**
 * @callback ExecuteData 
 * @param {String} query Script sql a ejecutar (SELECT)
 * @param  {Object<string, Number | string | null>} [parameters] Bind variables para el Script sql
 * @returns {Promise<Object<string, Number | string | null>[]>} [parameters] Bind variables para el Script sql
 */

//@returns {Promise<[{ columnName1: any, columnName2: any, columnNameN: any }, { columnName1: any, columnName2: any, columnNameN: any }, { }]>}

/**
 * @typedef {object} _SQLiteAsync
 * @property {() => Promise<void>} Open - Abre la conexión a la base de datos
 * @property {() => Promise<void>} Close - Cierra la conexión a la base de datos
 * @property {() => Promise<void>} BeginTransaction - Inicia una transacción
 * @property {() => Promise<void>} CommitTransaction - Ejecuta la transacción iniciada con BeginTransaction
 * @property {() => Promise<void>} RollbackTransaction - Cancela la transacción iniciada con BeginTransaction
 * @property {ExecuteNonQuery} ExecuteNonQuery - Ejecuta un Script sql, devuelve el número de registros insertados/actualizados si es un Script de inserción/actualización
 * @property {ExecuteEscalar} ExecuteEscalar - Ejecuta un Script sql (SELECT), devuelve el valor de la primera columna y fila del resultset, o nulo si no hay datos.
 * @property {ExecuteData} ExecuteData - Ejecuta un Script sql (SELECT), devuelve un array de objetos literales.
 * @property {() => Promise<boolean>} get_Disposed - Indica si la instancia se ha desechado
 * @property {() => Promise<boolean>} get_IsOpen - Indica si la conexión está abierta
 * @property {() => Promise<boolean>} get_IsTransaction - Indica si es una transacción
 * @property {() => Promise<string>} get_DatabasePath - Obtiene la ruta del archivo de base de datos
 * @property {() => Promise<void>} set_DatabasePath - Establece la ruta del archivo de base de datos
 * @property {() => Promise<Number>} get_Timeout - Obtiene el tiempo de espera (milisegundos) que espera la base de datos al hacer operaciones
 * @property {() => Promise<void>} set_Timeout - Establece el tiempo de espera (milisegundos) que espera la base de datos al hacer operaciones
 */

/**
 * @typedef {NativeInstance & _SQLiteAsync} SQLiteConnectionAsync
 */

/**
 * @typedef {NativeInstance & _SQLiteAsync} SQLiteConnection
 */


//#endregion

//#region Definición DeviceHandler

/**
 * @typedef {object} Information
 * @property {Readonly<string>} Model - Modelo del dispositivo
 * @property {Readonly<string>} Name - Nombre que tiene el dispositivo
 * @property {Readonly<string>} Manufacturer - Fabricante del dispositivo
 * @property {Readonly<string>} Version - Versión del SO del dispositivo
 * @property {Readonly<string>} Platform - Plataforma del dispositivo ["Android" || "iOS" || "macOS" || "tvOS" || "Tizen" || "UWP" || "watchOS" || "Unknown"]
 * @property {Readonly<string>} Idiom - Clase de dispositivo ["Phone" || "Tablet" || "Desktop" || "TV" || "Watch" || "Unknown"]
 * @property {Readonly<string>} DeviceType - Tipo de dispositivo ["Unknown" || "Physical" || "Virtual"]
 */

/**
 * @callback ShowToastMsg 
 * @param {String} msg Mensaje que se quiere desplegar en pantalla
 * @param {String} [duration = 'SHORT'] Duración del mensaje ["LONG" || "SHORT"]
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} _DeviceHandler
 * @property {() => Promise<Information>} get_Information - Obtiene un objeto con toda la información disponible del movil
 * @property {()=> Promise<boolean>} get_SupportOrientation - Indica si el dispositivo permite la manipulación de la orientación de la pantalla
 * @property {()=> Promise<string>} get_CurrentOrientation - Obtiene la orientación actual del dispositivo ["Undefined" || "Portrait" || "Landscape" || "PortraitFlipped" || "LandscapeFlipped"]
 * @property {(orientation: string) => Promise<void>} LockOrientation - Bloquea la orientación que defina el programador ["Undefined" || "Portrait" || "Landscape" || "PortraitFlipped" || "LandscapeFlipped"]
 * @property {() => Promise<void>} UnlockOrientation - Desbloquea la orientación si esta hubiese sido bloqueada con LockOrientation(...)
 * @property {(sleepMode: boolean) => Promise<void>} BlockSleepMode - Bloquear el modo de suspender el movil por falta de actividad del usuario
 * @property {ShowToastMsg} ShowToastMsg - Despliega un mensaje en pantalla utilizando la API nativa del SO
 * @property {(filePath: string) => Promise<boolean>} FileExists - Indica si el archivo especificado en la ruta existe
 * @property {(filePath: string) => Promise<void>} DeleteFile - Elimina el archivo especificado en la ruta
 * @property {(filePath: string) => Promise<String>} ReadFileText - Lee el contenido de un archivo como texto
 */

/**
 * @typedef {NativeInstance & _DeviceHandler} DeviceHandler
 */

//#endregion

//#region Definición DevicePermissions

/**
 * @typedef {object} _DevicePermissions - "CalendarRead" || "CalendarWrite" || "Camera" || "Microphone" || "..."
 * @property {(permissionName: string) => Promise<string>} CheckStatus - Obtiene el estado actual de un permiso ["Unknown" || "Denied" || "Disabled" || "Granted" || "Restricted"]
 * @property {(permissionName: string) => Promise<string>} Request - Pide autorización al usuario ["Unknown" || "Denied" || "Disabled" || "Granted" || "Restricted"]
 * @property {(permissionName: string) => Promise<boolean>} ShouldShowRationale - Obtiene la orientación actual del dispositivo ["Undefined" || "Portrait" || "Landscape" || "PortraitFlipped" || "LandscapeFlipped"]
 */

/**
 * @typedef {NativeInstance & _DevicePermissions} DevicePermissions - "CalendarRead" || "CalendarWrite" || "Camera" || "Microphone" || "..."
 */

//#endregion

//#region Definición AudioRecorder

/**
 * @callback Start 
 * @param {String} [filename] Nombre del archivo sin extension
 * @returns {Promise<true>}
 */

/**
 * @typedef {Object} _AudioRecord 
 * @property {() => Promise<string | null>} get_FilePath - Obtiene la ruta en donde se ha guardado la grabación
 * @property {() => Promise<boolean>} get_IsRecording - Indica si se está grabando
 * @property {Start} Start - Inicia la grabación del microfono
 * @property {() => Promise<string>} Stop - Devuelve la ruta del archivo de sonido, o un string Base64 del archivo de audio si se está usando protocolo http
 * @property {() => Promise<void>} Delete - Elimina la grabación actual
 * @property {() => Promise<string>} Stop - Devuelve un string Base64 del archivo de audio
 */

/**
 * @typedef {NativeInstance & _AudioRecord} AudioRecorder 
 */

//#endregion

//#region Definición User

/**
 * @typedef {object} StoryEntity UserStories
 * @property {Number} ID - UserStories.ID
 * @property {Number} IDUser - UserStories.IDUser
 * @property {Number | null} IDStoryType - UserStories.IDStoryType => 1: Texto, 2: Audio, 3: Recuerdo
 * @property {Number | null} IDMoodBefore - UserStories.IDMoodBefore => Moods.ID
 * @property {Number | null} IDAnswerBefore - UserStories.IDAnswerBefore => MoodAnswers.ID
 * @property {Number | null} IDMoodAfter - UserStories.IDMoodAfter => Moods.ID
 * @property {Number | null} IDAnswerAfter - UserStories.IDMoodAfter => MoodAnswers.ID
 * @property {Number} Date - UserStories.Date => Fecha en la que se creó la historia
 * @property {String | null} Title - UserStories.Title => Titulo de la historia
 * @property {String | null} Text - UserStories.Text => para IDStoryType === 1
 * @property {String | Number | null} Source - UserStories.Source => para IDStoryType !== 1
 */

/**
 * @typedef {object} _StoryOther UserStories
 * @property {() => StoryEntity} toJSON - 
 * @property {() => void} Clear - Limpia la Story
 * @property {() => void} Dispose
 */

/**
 * @typedef {StoryEntity & _StoryOther} Story UserStories
 */

/**
 * @typedef {object} UserEntity
 * @property {Number} ID - Users.ID
 * @property {Number} IDGender - Users.IDGender
 * @property {Number} Date - Users.Date
 * @property {String} Username - Users.Username
 * @property {Number} Age - Users.Age
 * @property {String} Password - Users.Password
 * @property {String} Phrase - Users.Phrase
 */

/**
 * @typedef {object} _Hobbies
 * @property {Number[]} HobbiesConnect - HobbiesConnect.ID[] => UserHobbiesConnect.IDHobby
 * @property {Number[]} HobbiesBeActive - HobbiesBeActive.ID => UserHobbiesBeActive.IDHobby
 * @property {Number[]} HobbiesKeepLearning - HobbiesKeepLearning.ID => UserHobbiesKeepLearning.IDHobby
 * @property {Number[]} HobbiesGive - HobbiesGive.ID => UserHobbiesGive.IDHobby
 * @property {Number[]} HobbiesTakeNotice - HobbiesTakeNotice.ID => UserHobbiesTakeNotice.IDHobby
 */

/**
 * @typedef {UserEntity & _Hobbies} UserState
 */

/**
 * @typedef {object} _UserOthers
 * @property {() => UserState} toJSON - 
 * @property {() => void} Clear - Vacia este objeto User
 * @property {Story} Story - Story del User
 * @property {() => void} Dispose - Dispose el objeto
 */

/**
 * @typedef {UserEntity & _Hobbies & _UserOthers} User 
 */

//#endregion


//#region Definición Components

/**
 * @typedef {object} ActionElement
 * @property {() => Promise<void>} Show - Mostrar elemento
 * @property {() => Promise<void>} Hide - Ocultar elemento
 */

/**
 * @typedef {ActionElement} LoadingScreen
 */

/**
 * @typedef {object} _ArrowButton
 * @property {String} Direction - Para establecer la dirección de la flecha
 */

/**
 * @typedef {HTMLElement & ActionElement & _ArrowButton} ArrowButton
 */

/**
 * @typedef {object} _ExitAlert
 * @property {() => void} onclickYes - Para establecer evento click en Yes
 * @property {() => void} onclickNo - Para establecer evento click en No
 * @property {String} Text - Establece el texto de la alerta
 */

/**
 * @typedef {HTMLElement & ActionElement & _ExitAlert} ExitAlert
 */

/**
 * @typedef {object} _MsgBox
 * @property {(text: String, time: Number) => Promise<void>} Show - Mostrar elemento
 * @property {() => Promise<void>} Hide - Ocultar elemento
 */

/**
 * @typedef {HTMLElement & _MsgBox} MsgBox
 */

/**
 * @typedef {object} _SimpleSlider
 * @property {HTMLCollectionOf<HTMLElement>} Slides - Todas las Slides del componente
 * @property {Number} Count - Cantidad de Slides
 * @property {Number} Index - Indice actual del slide en pantalla
 * @property {(content: HTMLElement | String) => HTMLElement} AddSlide - Agrega un Slide al componente, y lo retorna
 * @property {(index: Number) => HTMLElement} RemoveSlide - Remueve un slide por indice del componente, y lo retorna
 * @property {() => Promise<void>} NextSlide - Se mueve al siguiente Slide
 * @property {() => Promise<void>} PrevSlide - Se mueve al anterior Slide
 */

/**
 * @typedef {HTMLElement & _SimpleSlider} SimpleSlider
 */

/**
 * @typedef {object} Components
 * @property {Readonly<SimpleSlider>} SimpleSlider - Pantalla de carga
 * @property {Readonly<LoadingScreen>} LoadingScreen - Pantalla de carga
 * @property {Readonly<ArrowButton>} BackButton - Botón para anterior
 * @property {Readonly<ArrowButton>} NextButton - Botón para siguiente
 * @property {Readonly<ExitAlert>} ExitAlert - Mensaje de Si/No para salir de la App
 * @property {Readonly<ExitAlert>} LogOutAlert - Mensaje de SI/No para cerrar sesion en la App
 * @property {Readonly<MsgBox>} MsgError - Para mostrar mensajes de error
 * @property {Readonly<MsgBox>} MsgWarning - Para mostrar mensajes de advertencia
 * @property {Readonly<MsgBox>} MsgInfo - Para mostrar mensajes de información
 */

//#endregion


/**
 * @typedef {object} Utils
 * @property {(root: HTMLElement) => NodeListOf<HTMLInputElement>} GetInputsChecked - Obtiene una lista de los Inputs que estan marcados
 * @property {(root: HTMLElement) => HTMLInputElement | null} GetRadioInputChecked - Obtiene el Input tipo radio que ha sido seleccionado
 * @property {(root: HTMLSelectElement) => HTMLOptionElement | null} GetSelectedOption - Obtiene la <option> seleccionada 
 * @property {(root: HTMLSelectElement | HTMLOptGroupElement | HTMLDataListElement, text: string, [value]: string) => HTMLOptionElement} AddOptionElement - Agrega opciones al control
 * @property {(root: HTMLSelectElement, value: string) => HTMLOptionElement | null} SelectOptionByValue - Selecciona la <option> del control por valor
 * @property {(root: HTMLSelectElement, index: number) => HTMLOptionElement | null} SelectOptionByIndex - Selecciona la <option> del control por indice
 * @property {(time: Number) => Promise<void>} DelayAsync - Un delay, utilizar "await"
 * @property {(obj: any) => boolean} IsPlainObject - Verifica si es un objeto simple plano
 * @property {(target: any, source: any) => any} ClonePlainObject - Similar a Object.assing, pero mas poderoso
 * @property {(user: User) => Promise<void>} InsertUser - Inserta un usuario en base de datos
 * @property {(story: Story) => Promise<void>} InsertStory - Inserta una story en base de datos
 * @property {(user: User) => Promise<void>} PopulatetUser - Establece los valores del objeto User aportado como parametro
 * @property {(hobbyName: String) => Promise<{ID: Number, Name: String}[]>} GetAllHobbies - Obtiene todos los campos de la tabla de hobbies
 */

/**
 * @typedef {object} Route
 * @property {String} url - url para el hash
 * @property {String} html - Ruta del recurso html
 * @property {String} load - Ruta del recurso js
 */

/**
 * @typedef {object} StoryType
 * @property {Number} Text - Write your feelings
 * @property {Number} Audio - Record an audio
 * @property {Number} Review - Review previous thoughts
 * @property {Number} Nothing - Review previous thoughts
 */

//#region Definición MENHIR

/**
 * @typedef {object} MENHIR 
 * @property {Readonly<User>} User - Objeto Entidad del usuario logueado/creado
 * @property {Readonly<SQLiteConnectionAsync>} SQLite - Objeto Nativo para acceso base de datos
 * @property {Readonly<DeviceHandler>} DeviceHandler - Objeto Nativo para acceso algunas caracteristicas del móvil
 * @property {Readonly<DevicePermissions>} DevicePermissions - Objeto Nativo para controlar los permisos
 * @property {Readonly<AudioRecorder>} AudioRecorder - Objeto Nativo para controlar la grabación de voz
 * @property {Readonly<Components>} Components - Componentes prefabricados para el DOM
 * @property {import('../Routes.js').Router} Routes - Rutas/Flujo de pantallas
 * @property {StoryType} StoryType - Tipos de Stories
 * @property {Readonly<Xam>} Xam - Objeto Nativo de acceso general
 * @property {Readonly<Utils>} Utils - Utilidades
 * @property {Window} Window - window object
 * @property {Document} Document - document object
 * @property {(route: Route | String) => void} GoTo - Metodo para renderizar vista y ejecutar carga de la vista
 */

//#endregion

/**
 * @typedef {object} _PlayerSound
 * @property {string} src - src or base64 string sound file
 * @property {() => Promise<void>} Play - Play audio
 * @property {Function} Pause - Pause audio
 * @property {Function} Stop - Stop Audio
 * @property {Number} Volume - Volume
 */

/**
 * @typedef {HTMLElement & _PlayerSound} HTMLPlayerSoundElement
 */

//exports.unused = {};
export const some = {};