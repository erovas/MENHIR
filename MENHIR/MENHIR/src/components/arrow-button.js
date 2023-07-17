class ArrowButton extends HTMLElement {

    #time = 200; //ms
    #Arrow = document.createElement('arrow-icon');
    #Dir = ['left', 'up', 'right', 'down'];

    constructor(){
        super();
    }

    Show(){
        this.className = 'show';
        return this.#response;
    }

    Hide(){
        this.className = 'hide';
        return this.#response;
    }

    connectedCallback(){
       this.append(this.#Arrow);
    }

    disconnectedCallback(){
        this.#Arrow.remove();
    }

    get Direction(){
        const dir = this.getAttribute('data-direction');

        if(dir == null || dir.trim() == '')
            return this.#Dir[0];

        return dir;
    }

    set Direction(value){
        value = (value + '').toLowerCase();

        if(this.#Dir.includes(value))
            this.setAttribute('data-direction', value);
    }

    get #response(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.#time);
        });
    }

}

customElements.define("arrow-button", ArrowButton);