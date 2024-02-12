import { UserNotification } from './Classes.js';

const HOBBIES_NAME = ['HobbiesConnect', 'HobbiesBeActive', 'HobbiesKeepLearning', 'HobbiesGive', 'HobbiesTakeNotice'];

/**
 * @type {import('./TypesDef').SQLiteConnectionAsync}
 */
let SQLite = null;


/**
 * 
 * @param {HTMLElement} root 
 * @returns {NodeListOf<HTMLInputElement>}
 */
function GetInputsChecked(root){
    return root.querySelectorAll('input:checked');
}

/**
 * 
 * @param {HTMLElement} root 
 * @returns {HTMLInputElement | null}
 */
function GetRadioInputChecked(root){
    return root.querySelector('input[type="radio"]:checked');
} 

/**
 * 
 * @param {HTMLSelectElement} root 
 * @returns {HTMLOptionElement | null}
 */
function GetSelectedOption(root) {
    
    if(root.options.length < 1)
        return null;

    return root.options[root.selectedIndex];
}

/**
 * 
 * @param {HTMLSelectElement | HTMLOptGroupElement | HTMLDataListElement} root 
 * @param {String} text 
 * @param {String} [value] 
 * @returns {HTMLOptionElement}
 */
function AddOptionElement(root, text, value){
    const option = document.createElement('option');
    value = value || text;
    option.value = value;
    option.innerText = text;
    root.append(option);
    return option;
}

/**
 * 
 * @param {HTMLSelectElement} root 
 * @param {String} value
 * @returns {HTMLOptionElement | null}
 */
function SelectOptionByValue(root, value) {

    if(root.options.length < 1)
        return null;

    value = value + '';

    for (let i = 0; i < root.options.length; i++) {
        const option = root.options[i];

        if(option.value != value)
            continue;

        option.selected = true;
        return option;    
    }

    return null;
}

/**
 * 
 * @param {HTMLSelectElement} root 
 * @param {Number} index
 * @returns {HTMLOptionElement | null}
 */
function SelectOptionByIndex(root, index) {

    if(root.options.length < 1)
        return null;

    index = parseInt(index);

    if(index < 0 || index > root.options.length - 1)
        return null;

    root.selectedIndex = index;

    return root.options[root.selectedIndex];
}

/**
 * 
 * @param {Number} time 
 */
function DelayAsync(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/**
 * Verifica si es un objeto simple plano
 * @param {any} obj 
 * @returns 
 */
function IsPlainObject(obj) {
    if( //Separate from primitives
        typeof obj === 'object' &&
        //Separate build-in like Math
        Object.prototype.toString.call(obj) === '[object Object]'
        ){
        let props = Object.getPrototypeOf(obj);
        //obj == Object.create(null) || Separate instances (Array, DOM, ...)
        return props === null || props.constructor === Object;
    }

    return false;
}

/**
 * Similar to Object.assing, but more powerful
 * @param {any} target 
 * @param {any} source 
 * @returns 
 */
function ClonePlainObject(target, source){
    Object.getOwnPropertyNames(source).forEach(function(name){
        Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
    });

    return target;
}

/**
 * Crea un GUID (Global Unique Identifier)
 * @returns 
 */
function NewGUID(){
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * 
 * @param {import('./TypesDef.js').User} user 
 */
async function InsertUser(user) {
    

    user.Date = user.Date < 1? Date.now() : user.Date;

    //#region Creacion cabecera User

    let sql = 
    `
        INSERT INTO Users
            (
                ID,
                IDGender,
                Date,
                Username,
                Age,
                Password,
                Phrase
            )
        VALUES
            (
                @ID,
                @IDGender,
                @Date,
                @Username,
                @Age,
                @Password,
                @Phrase
            )
    `;

    let parameters = {
        ID: NewGUID(),
        IDGender: user.IDGender,
        Date:     user.Date,
        Username: user.Username,
        Age:      user.Age,
        Password: user.Password,
        Phrase: user.Phrase
    };

    try {
        await SQLite.Open();
        // Crear usuario en la tabla Users
        await SQLite.ExecuteNonQuery(sql, parameters);
        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
    

    // Una vez creado, se recupera su ID
    sql = 
    `
        SELECT ID
        FROM Users
        WHERE Username = @Username
        AND Password = @Password
    `;

    parameters = {
        Username: user.Username,
        Password: user.Password
    };

    try {
        await SQLite.Open();
        user.ID = await SQLite.ExecuteEscalar(sql, parameters);
        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
    

    //#endregion

    //#region Agregar sus hobbies

    sql = 
    `
        INSERT INTO UserHobbies
            (
                IDUser,
                IDHobby
            )
        VALUES
            (
                @IDUser,
                @IDHobby
            )
    `;

    parameters = {
        IDUser: user.ID,
        IDHobby: 0
    }

    for (let i = 0; i < HOBBIES_NAME.length; i++) {
        const HobbyName = HOBBIES_NAME[i];
        const NewSql = sql.replace('Hobbies', HobbyName);
        
        /**
         * @type {Number[]}
         */
        const HobbiesWellbeing = user[HobbyName];

        for (let j = 0; j < HobbiesWellbeing.length; j++) {
            parameters.IDHobby = HobbiesWellbeing[j];
            try {
                await SQLite.Open();
                await SQLite.ExecuteNonQuery(NewSql, parameters);
                await SQLite.Close();
            } catch (error) {
                try {
                    await SQLite.Close();
                } catch (error) { }
                throw error;
            }
        }
    }

    //#endregion
    
}

/**
 * 
 * @param {import('./TypesDef.js').Story} story 
 */
async function InsertStory(story) {
    let sql = 
    `
        INSERT INTO UserStories
            (
                IDUser,
                IDStoryType,
                IDMoodBefore,
                IDAnswerBefore,
                IDMoodAfter,
                IDAnswerAfter,
                Date,
                Title,
                Text,
                Source,
                Suggested
            )
        VALUES
            (
                @IDUser,
                @IDStoryType,
                @IDMoodBefore,
                @IDAnswerBefore,
                @IDMoodAfter,
                @IDAnswerAfter,
                @Date,
                @Title,
                @Text,
                @Source,
                @Suggested
            )
    `;

    story.Date = Date.now();
    const parameters = story.toJSON();

    try {
        await SQLite.Open();
        await SQLite.ExecuteNonQuery(sql, parameters);    
        await SQLite.Close();
    } catch (error) {
        
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }

    //Se ha insertado, recuperar el ID del Story
    sql = 
    `
        SELECT ID
        FROM UserStories
        WHERE IDUser = @IDUser
        AND Date = @Date
    `;

    let ID;
    const paramss = {
        IDUser: parameters.IDUser,
        Date: parameters.Date
    }

    try {
        await SQLite.Open();
        ID = await SQLite.ExecuteEscalar(sql, paramss);
        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
    
    story.ID = ID;
}

/**
 * 
 * @param {import('./TypesDef.js').User} user 
 */
async function PopulatetUser(user) {
    let sql = 
    `
        SELECT
            ID,
            IDGender,
            Date,
            Username,
            Age,
            Password,
            Phrase
        FROM Users
        WHERE 1 = 1
        AND Username = @Username
        AND Password = @Password
    `;

    let parameters = {
        Username: user.Username,
        Password: user.Password
    }

    await SQLite.Open();
    /**
     * @type {import('./js/TypesDef.js').UserEntity[]}
     */
    const data = await SQLite.ExecuteData(sql, parameters);
    await SQLite.Close();
    
    if(data.length < 1)
        return;

    const userEntity = data[0];

    for (const key in userEntity)
        if (Object.hasOwnProperty.call(userEntity, key))
            user[key] = userEntity[key];
    
    sql = 
    `
        SELECT IDHobby  
        FROM UserHobbies
        WHERE IDUser = @IDUser
    `;

    parameters = {
        IDUser: user.ID
    }

    await SQLite.Open();

    for (let i = 0; i < HOBBIES_NAME.length; i++) {
        const HobbyName = HOBBIES_NAME[i];
        const NewSql = sql.replace('Hobbies', HobbyName);
        
        /**
         * @type {Number[]}
         */
        const HobbiesWellbeing = user[HobbyName]

        /**
         * @type {{IDHobby: Number}[]}
         */
        const IDs = await SQLite.ExecuteData(NewSql, parameters);

        for (let j = 0; j < IDs.length; j++)
            HobbiesWellbeing.push(IDs[j].IDHobby);
    }

    await SQLite.Close();
}

/**
 * 
 * @param {String} hobbyName 
 * @returns {Promise<{ID: Number, Name: String}[]>}
 */
async function GetAllHobbies(hobbyName) {

    const sql = 
    `
        SELECT
            ID,
            Name
        FROM HobbiesNAME
        ORDER BY ID ASC
    `;

    await SQLite.Open();
    const data = await SQLite.ExecuteData(sql.replace('NAME', hobbyName.replaceAll(' ', '')))
    await SQLite.Close();

    return data;
}

/**
 * 
 * @param {import('./TypesDef.js').UserNotification} userNotification 
 */
async function InsertUserNotification(userNotification){
    let sql = 
    `
        INSERT INTO UserNotification
            (
                IDUser,
                IDStory,
                TableName,
                HobbiesIDs,
                Date,
                DateResponse,
                IDHobbyResponse,
                FeelResponse
            )
        VALUES
            (
                @IDUser,
                @IDStory,
                @TableName,
                @HobbiesIDs,
                @Date,
                @DateResponse,
                @IDHobbyResponse,
                @FeelResponse
            )
    `;

    userNotification.Date = Date.now();

    let parameters = userNotification.toJSON();

    delete parameters.ID;
    parameters.HobbiesIDs = JSON.stringify(parameters.HobbiesIDs)

    try {
        await SQLite.Open();
        await SQLite.ExecuteNonQuery(sql, parameters);    
        await SQLite.Close();
    } catch (error) {
        
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }

    //Se ha insertado, recuperar el ID del UserNotification
    sql = 
    `
        SELECT ID
        FROM UserNotification
        WHERE IDUser = @IDUser
        AND IDStory = @IDStory
    `;

    parameters = {
        IDUser: userNotification.IDUser,
        IDStory: userNotification.IDStory
    }

    let ID;

    try {
        await SQLite.Open();
        ID = await SQLite.ExecuteEscalar(sql, parameters);
        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
    
    userNotification.ID = ID;
}

/**
 * 
 * @param {import('./TypesDef.js').UserNotification} userNotification 
 */
async function UpdateUserNotification(userNotification){
    let sql = 
    `
        UPDATE UserNotification SET
            DateResponse = @DateResponse,
            IDHobbyResponse = @IDHobbyResponse,
            FeelResponse = @FeelResponse
        WHERE ID = @ID
    `;

    userNotification.DateResponse = Date.now();

    let parameters = {
        DateResponse: userNotification.DateResponse,
        IDHobbyResponse: userNotification.IDHobbyResponse,
        FeelResponse: userNotification.FeelResponse,
        ID: userNotification.ID
    }

    try {
        await SQLite.Open();
        await SQLite.ExecuteNonQuery(sql, parameters);    
        await SQLite.Close();
    } catch (error) {
        
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
}

/**
 * @param {import('./TypesDef.js').UserNotification} userNotification 
 */
async function GetTextosValoresSugerencias(userNotification){
    let sql = 
    `
        SELECT Name
        FROM TableName
        WHERE ID = @ID
    `;

    sql = sql.replace('TableName', userNotification.TableName);

    let parameters = {
        ID: 0
    }

    const salida = [];

    try {
        await SQLite.Open();

        for (let index = 0; index < userNotification.HobbiesIDs.length; index++) {
            parameters.ID = userNotification.HobbiesIDs[index]
            const texto = await SQLite.ExecuteEscalar(sql, parameters)
            salida.push({ texto: texto, valor: parameters.ID });
        }

        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }
    
    return salida;
}

/**
 * 
 * @param {Number} ID 
 * @returns
 */
async function GetUserNotificationEntity(ID){
    let sql = 
    `
    SELECT *
    FROM UserNotification
    WHERE ID = @ID
    `;

    let parameters = {
        ID: ID
    }

    let resultado = {};

    try {
        await SQLite.Open();
        resultado = (await SQLite.ExecuteData(sql, parameters))[0];
        await SQLite.Close();    
    } catch (error) {
        try {
            await SQLite.Close();
        } catch (error) { }
        throw error;
    }

    resultado.HobbiesIDs = JSON.parse(resultado.HobbiesIDs);
    
    return resultado;
}

/**
 * Funciones utiles
 * @param {import('./TypesDef').SQLiteConnectionAsync} SQLiteConnection 
 */
export default function(SQLiteConnection){

    SQLite = SQLiteConnection;

    return {
        get GetInputsChecked(){
            return GetInputsChecked;
        },

        get GetRadioInputChecked(){
            return GetRadioInputChecked;
        },

        get GetSelectedOption(){
            return GetSelectedOption;
        },

        get AddOptionElement(){
            return AddOptionElement;
        },

        get SelectOptionByValue(){
            return SelectOptionByValue;
        },

        get SelectOptionByIndex(){
            return SelectOptionByIndex;
        },

        get DelayAsync(){
            return DelayAsync;
        },

        get IsPlainObject(){
            return IsPlainObject;
        },

        get ClonePlainObject(){
            return ClonePlainObject;
        },

        get InsertUser(){
            return InsertUser;
        },

        get InsertStory(){
            return InsertStory;
        },

        get PopulatetUser(){
            return PopulatetUser;
        },

        get GetAllHobbies(){
            return GetAllHobbies;
        },

        get NewGUID(){
            return NewGUID;
        },

        get InsertUserNotification(){
            return InsertUserNotification;
        },

        get UpdateUserNotification(){
            return UpdateUserNotification;
        },

        get GetTextosValoresSugerencias(){
            return GetTextosValoresSugerencias;
        },

        get GetUserNotificationEntity(){
            return GetUserNotificationEntity;
        }
    }
}