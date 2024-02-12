const SEPARATOR = '@#~¬';
const NAMES = [];

//#region FUNCIONES

function SetValue(name, value){
    
    if(typeof name !== 'string' || name.length < 1)
        return;

    const type = typeof value;

    if(type == 'string' || type == 'number')
        return sessionStorage.setItem(name, type + SEPARATOR + value);

    sessionStorage.setItem(name, type + SEPARATOR + JSON.stringify(value));
}

function GetValue(name, defaultValue){

    if(typeof name !== 'string' || name.length < 1)
        return defaultValue;

    const serialized = sessionStorage.getItem(name);

    if(serialized == null)
        return defaultValue;

    const arr = serialized.split(SEPARATOR);
    const type = arr[0];
    const raw = arr[1];

    if(type == 'string')
        return raw;
    if(type == 'number')
        return parseFloat(raw);
    
    const parsed = JSON.parse(raw);

    if(typeof parsed !== typeof defaultValue)
        throw `Retreive value is not a ${typeof defaultValue}`;

    return parsed;
}

function RemoveValue(name){

    if(typeof name !== 'string' || name.length < 1)
        return;

    sessionStorage.removeItem(name);

    const index = NAMES.indexOf(name);

    if(index < 0)
        return;

    // Dejar disponible el nombre
    NAMES.splice(index, 1);
}

function IsAscessor(obj, prop){
    let desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (desc)
        return !('value' in desc) && !!desc.set

    return (obj.prototype, prop)
}

function RegisterName(name){
    if(typeof name !== 'string' || name.length < 1)
    return;

    if(NAMES.includes(name))
        throw `Already exists a session object instance with name "${name}".`

    NAMES.push(name);
}

/**
 * Parsea el valor a un entero positivo o nulo
 * @param {Number | Date} value 
 * @returns {Number | null}
 */
function ParseIntNull(value){
    if(value instanceof Date)
        value = value.getTime();

    try {
        value = parseInt(value);

        if(value < 0)
            return - value;

        if(isNaN(value))
            return null;

    } catch (error) { 
        value = null;
    }

    return value;
}

/**
 * Parsea el valor a un entero positivo
 * @param {Number | Date} value 
 * @returns {Number}
 */
function ParseInt(value){

    value = ParseIntNull(value);
    
    if(value == null)
        value = 0;

    return value;
}

/**
 * Convierte un valor cualquiera a String o a null en su defecto
 * @param {*} value 
 * @returns {String | null}
 */
function ToStringNull(value){
    if(typeof value != 'number' && typeof value != 'string')
        value = null;

    return value == null? value : value + '';
}

/**
 * Check if "obj" is a "{}" or "Object.create(null)"
 * @param {Object} obj 
 * @returns 
 */
function IsPlainObject(obj){

    if(
        //Basic check
        //obj !== null &&  //No es necesario
        //Separate from primitives
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

//#endregion

class SessionArray {

    /**
     * @type {any[]}
     */
    #arr;
    #name;

    constructor(name, value){
        RegisterName(name);
        this.#name = name;
        this.#arr = GetValue(name, Array.isArray(value)? value : []);
        this.#SetValue();
        const that = this;

        return new Proxy(this, {
            get(target, prop){
                if(Number(prop) == prop && !(prop in target))
                    return that.#arr[prop];

                let value = target[prop];
                return typeof value == 'function' ? value.bind(target) : value;
            },

            set(target, prop, newValue){
                if(Number(prop) == prop && !(prop in target)){
                    that.#arr[prop] = newValue;
                    that.#SetValue();
                    return true;
                }

                if(prop in target && IsAscessor(target, prop)){
                    target[prop] = newValue;
                    that.#SetValue();
                    return true;
                }
            },

            deleteProperty() { // to intercept property deletion
                //No dejar borrar ninguna propiedad
                return false;
            },

            defineProperty() {
                //Evitar definir nuevas propiedades o sobre escribirlas con Object.defineProperty
                return true;
            },

            setPrototypeOf() {
                //Evitar seteo con Object.setPrototypeOf(...)
                return true;
            }
        });
    }

    get name(){
        return this.#name;
    }

    get length(){
        return this.#arr.length;
    }

    set length(value){
        if(Number(value) !== value)
            return;

        this.#arr.length = value;
        this.#SetValue();
    }

    clear(){
        this.#arr.length = 0;
        this.#SetValue();
    }

    push(...items){
        const value = this.#arr.push(...items);
        this.#SetValue();
        return value;
    }

    pop(){
        const value = this.#arr.pop();
        this.#SetValue();
        return value;
    }

    reverse(){
        this.#arr.reverse();
        this.#SetValue();
        return this;
    }

    shift(){
        const value = this.#arr.shift();
        this.#SetValue();
        return value;
    }

    sort(...args){
        const value = this.#arr.sort(...args);
        this.#SetValue();
        return this;
    }

    splice(...args){
        const valuesDelete = this.#arr.splice(...args)
        this.#SetValue();
        return new SessionArray(null, valuesDelete);
    }

    unshift(...args){
        const value = this.#arr.unshift(...args);
        this.#SetValue();
        return value;
    }

    indexOf(...args){
        return this.#arr.indexOf(...args);
    }

    includes(...args){
        return this.#arr.includes(...args);
    }

    getArray(){
        const result = [];
        for (let i = 0; i < this.#arr.length; i++)
            result.push(this.#arr[i])
        
        return result;
    }

    Dispose(){
        RemoveValue(this.#name);
        this.#name = null;
        this.#arr = undefined;
    }

    toJSON(){
        return this.getArray();
    }

    #SetValue(){
        SetValue(this.#name, this.#arr);
    }

}

class SessionObject {
    #value;
    #name

    constructor(name, value){
        RegisterName(name);
        this.#name = name;
        this.#value = GetValue(name, IsPlainObject(value)? value : Object.create(null));
        this.#SetValue();
        const that = this;

        return new Proxy(this, {
            get(target, prop){

                if(prop in target){
                    let value = target[prop];
                    return typeof value == 'function' ? value.bind(target) : value;
                }

                return that.#value[prop];
            },

            set(target, prop, newValue){

                // NO dejar sobre escribir propiedades "nativas" del objeto
                if(prop in target)
                    return true;
                
                that.#value[prop] = newValue;
                that.#SetValue();
                return true;
            },

            deleteProperty(target, prop) { // to intercept property deletion

                // NO dejar eliminar propiedades "nativas" del objeto
                if(prop in target)
                    return true;

                return delete that.#value[prop];
            },

            defineProperty() {
                //Evitar definir nuevas propiedades o sobre escribirlas con Object.defineProperty
                return true;
            },

            setPrototypeOf() {
                //Evitar seteo con Object.setPrototypeOf(...)
                return true;
            }
        });
    }

    get name(){
        return this.#name;
    }

    getObject(){
        const result = Object.create(null);
        for (const key in this.#value) 
            if (Object.hasOwnProperty.call(this.#value, key)) 
                result[key] = this.#value[key];
            
        return result;
    }

    Dispose(){
        RemoveValue(this.#name);
        this.#value = undefined;
    }

    toJSON(){
        return this.getObject();
    }

    #SetValue(){
        SetValue(this.#name, this.#value);
    }
}

class Story {

    #value;

    /**
     * 
     * @param {String | null} name 
     * @param {Number} IDUser 
     */
    constructor(name){
        const value = {
            ID: 0,
            /* IDUser: 0, */
            IDUser: '',
            IDStoryType: 0,
            IDMoodBefore: null,
            IDAnswerBefore: null,
            IDMoodAfter: null,
            IDAnswerAfter: null,
            Date: 0,
            Title: null,
            Text: null,
            Source: null,
            Suggested: null,
        }

        this.#value = new SessionObject(name, value);
    }

    get ID(){
        return this.#value.ID;
    }
    set ID(value){
        this.#value.ID = ParseInt(value);
    }

    get IDUser(){
        return this.#value.IDUser;
    }

    set IDUser(value){
        //this.#value.IDUser  = ParseInt(value);
        this.#value.IDUser  = value + '';
    }

    get IDStoryType(){
        return this.#value.IDStoryType;
    }
    set IDStoryType(value){
        this.#value.IDStoryType = ParseInt(value);
    }

    get IDMoodBefore(){
        return this.#value.IDMoodBefore;
    }
    set IDMoodBefore(value){
        this.#value.IDMoodBefore = ParseIntNull(value);
    }

    get IDAnswerBefore(){
        return this.#value.IDAnswerBefore;
    }

    set IDAnswerBefore(value){
        this.#value.IDAnswerBefore = ParseIntNull(value);
    }

    get IDMoodAfter(){
        return this.#value.IDMoodAfter;
    }
    set IDMoodAfter(value){
        this.#value.IDMoodAfter = ParseIntNull(value);
    }

    get IDAnswerAfter(){
        return this.#value.IDAnswerAfter;
    }

    set IDAnswerAfter(value){
        this.#value.IDAnswerAfter = ParseIntNull(value);
    }

    get Date(){
        return this.#value.Date;
    }
    set Date(value){
        this.#value.Date = ParseInt(value);
    }

    get Title(){
        return this.#value.Title;
    }
    set Title(value){
        this.#value.Title = ToStringNull(value);
    }

    get Text(){
        return this.#value.Text;
    }
    set Text(value){
        this.#value.Text = ToStringNull(value);
    }

    get Source(){
        return this.#value.Source;
    }
    set Source(value){
        this.#value.Source = ToStringNull(value);
    }

    get Suggested(){
        return this.#value.Suggested;
    }

    set Suggested(value){
        this.#value.Suggested = ToStringNull(value);
    }

    Dispose(){
        this.#value.Dispose();
        this.#value = undefined;
    }

    Clear(){
        this.ID = 0;
        //this.IDUser = 0;
        this.IDUser = '';
        this.IDStoryType = 0;
        this.IDMoodBefore = null;
        this.IDAnswerBefore = null;
        this.IDMoodAfter = null;
        this.IDAnswerAfter = null
        this.Date = 0;
        this.Title = null;
        this.Text = null;
        this.Source = null;
        this.Suggested = null;
    }

    toJSON(){
        return this.#value.getObject();
    }

}

class User {

    //#region UserEntity
    #value;

    //#endregion

    //#region Hobbies

    #HobbiesConnect = new SessionArray('MH-HobbiesConnect');
    #HobbiesBeActive = new SessionArray('MH-HobbiesBeActive');
    #HobbiesKeepLearning = new SessionArray('MH-HobbiesKeepLearning');
    #HobbiesGive = new SessionArray('MH-HobbiesGive');
    #HobbiesTakeNotice = new SessionArray('MH-HobbiesTakeNotice');

    //#endregion

    /**
     * @type {Story}
     */
    #Story = null;

    constructor(){
        const value = {
            //ID: 0,
            ID: '',
            IDGender: 0,
            Date: 0,
            Username: '',
            Age: 0,
            Password: '',
            Phrase: '',
        }

        this.#value = new SessionObject('MH-UserEntity', value);
        this.#Story = new Story('MH-UserStory');
    }

    //#region UserEntity

    get ID(){
        return this.#value.ID;
    }
    set ID(value){
        //this.#value.ID = ParseInt(value);
        this.#value.ID = value + '';
        this.#Story.IDUser = this.#value.ID;
    }

    get IDGender(){
        return this.#value.IDGender;
    }
    set IDGender(value){
        this.#value.IDGender = ParseInt(value);
    }

    get Date(){
        return this.#value.Date;
    }
    set Date(value){
        this.#value.Date = ParseInt(value);
    }

    get Username(){
        return this.#value.Username;
    }
    set Username(value){
        if(typeof value == 'string')
            this.#value.Username = value;
    }

    get Age(){
        return this.#value.Age;
    }
    set Age(value){
        this.#value.Age = ParseInt(value);
    }

    get Password(){
        return this.#value.Password;
    }
    set Password(value){
        if(typeof value == 'string')
            this.#value.Password = value;
    }

    get Phrase(){
        return this.#value.Phrase;
    }

    set Phrase(value){
        if(typeof value == 'string')
            this.#value.Phrase = value;
    }

    //#endregion

    //#region Hobbies

    get HobbiesConnect(){
        return this.#HobbiesConnect;
    }

    get HobbiesBeActive(){
        return this.#HobbiesBeActive;
    }

    get HobbiesKeepLearning(){
        return this.#HobbiesKeepLearning;
    }

    get HobbiesGive(){
        return this.#HobbiesGive;
    }

    get HobbiesTakeNotice(){
        return this.#HobbiesTakeNotice;
    }

    //#endregion

    get Story(){
        return this.#Story;
    }

    Dispose(){
        this.#value.Dispose();
        this.#value = undefined;

        this.HobbiesConnect.Dispose();
        this.HobbiesBeActive.Dispose();
        this.HobbiesKeepLearning.Dispose();
        this.HobbiesGive.Dispose();
        this.HobbiesTakeNotice.Dispose();

        this.#HobbiesConnect = undefined;
        this.#HobbiesBeActive = undefined;
        this.#HobbiesKeepLearning = undefined;
        this.#HobbiesGive = undefined;
        this.#HobbiesTakeNotice = undefined;

        this.#Story.Dispose();
        this.#Story = undefined;
    }

    Clear(){
        //this.ID = 0;
        this.ID = '';
        this.IDGender = 0;
        this.Date = 0;
        this.Username = '';
        this.Age = 0;
        this.Password = '';
        this.Phrase = '';

        this.HobbiesConnect.clear();
        this.HobbiesBeActive.clear();
        this.HobbiesKeepLearning.clear();
        this.HobbiesGive.clear();
        this.HobbiesTakeNotice.clear();

        this.Story.Clear();
    }

    toJSON(){
        const result = this.#value.getObject();
        result.HobbiesConnect = this.HobbiesConnect.getArray();
        result.HobbiesBeActive = this.HobbiesBeActive.getArray();
        result.HobbiesKeepLearning = this.HobbiesKeepLearning.getArray();
        result.HobbiesGive = this.HobbiesGive.getArray();
        result.HobbiesTakeNotice = this.HobbiesTakeNotice.getArray();
        result.Story = this.Story.toJSON();

        return result;
    }
}

class UserNotification {

    #value;

    #HobbiesIDs = new SessionArray('MH-HobbiesIDs');

    constructor(){
        const value = {
            ID: 0,
            IDUser: '',
            IDStory: 0,
            TableName: '',
            
            Date: 0,
            DateResponse: 0,
            IDHobbyResponse: 0,
            FeelResponse: 0,
        }

        this.#value = new SessionObject('MH-UserNotification', value);
    }

    get ID(){
        return this.#value.ID;
    }
    set ID(value){
        this.#value.ID = ParseInt(value);
    }

    get IDUser(){
        return this.#value.IDUser;
    }
    set IDUser(value){
        this.#value.IDUser = value + '';
    }

    get IDStory(){
        return this.#value.IDStory;
    }
    set IDStory(value){
        this.#value.IDStory = ParseInt(value);
    }

    get TableName(){
        return this.#value.TableName;
    }
    set TableName(value){
        if(typeof value == 'string')
            this.#value.TableName = value;
    }

    get HobbiesIDs(){
        return this.#HobbiesIDs;
    }

    get Date(){
        return this.#value.Date;
    }
    set Date(value){
        this.#value.Date = ParseInt(value);
    }

    get DateResponse(){
        return this.#value.DateResponse;
    }
    set DateResponse(value){
        this.#value.DateResponse = ParseInt(value);
    }

    get IDHobbyResponse(){
        return this.#value.IDHobbyResponse;
    }
    set IDHobbyResponse(value){
        this.#value.IDHobbyResponse = ParseInt(value);
    }

    get FeelResponse(){
        return this.#value.FeelResponse;
    }

    set FeelResponse(value){
        this.#value.FeelResponse = ParseInt(value);
    }

    Clear() {
        this.ID = 0;
        this.IDUser = '';
        this.IDStory = 0;
        this.TableName = '';
        this.Date = 0;
        this.DateResponse = 0;
        this.IDHobbyResponse = 0;
        this.FeelResponse = 0;
        this.HobbiesIDs.clear();
    }

    Dispose(){
        this.#value.Dispose()
        this.#value = undefined;
        
        this.HobbiesIDs.Dispose();
        this.#HobbiesIDs = undefined;
    }

    toJSON(){
        const result = this.#value.getObject();
        result.HobbiesIDs = this.HobbiesIDs.getArray();

        return result;
    }

}

export { User, Story, SessionObject, SessionArray, UserNotification }