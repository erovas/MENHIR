class LoadingScreen extends HTMLElement {

    #time = 200; //ms
    #spinner = document.createElement('loading-spinner');

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
       this.append(this.#spinner);
    }

    disconnectedCallback(){
        this.#spinner.remove();
    }

    get #response(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.#time);
        });
    }

}

customElements.define("loading-screen", LoadingScreen);