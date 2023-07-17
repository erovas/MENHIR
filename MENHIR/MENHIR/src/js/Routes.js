const KeyStorage = 'MH-route';

const Routes = { 

    get Current(){
        let route = localStorage.getItem(KeyStorage);

        // No hay ruta inicial, se setea el primero por defecto
        if(route == null)
            route = NAMES[0];

        // La ruta encontrada no existe en el diccionario
        if(!NAMES.includes(route))
            route = NAMES[0];
        
        this.Current = route;
        return route;
    },

    set Current(value){
        localStorage.setItem(KeyStorage, value);
    }
};

const NAMES = 
    [
        'SC_00', 
        
        'SC_01', 
        
        'SC_01_1A',
        'SC_01_2A',
        'SC_01_3A',
        'SC_01_4A',
        'SC_01_5A',
        'SC_01_6A',
        'SC_01_1B',
        'SC_01_2B',

        'SC_02',

        'SC_03',

        'SC_04',
        'SC_04A',
        'SC_04B',
        'SC_04C',

        'SC_05',
        'SC_05_1A',
        'SC_05_2A',
        'SC_05_1B',

        'SC_06',

        'SC_07'
    ];

NAMES.forEach(item => { 
    Object.defineProperty(Routes, item, {
        get(){
            return item;
        }
    });
});

export default Routes;
