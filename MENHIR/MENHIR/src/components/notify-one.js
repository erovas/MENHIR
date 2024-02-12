class NotifyOne extends HTMLElement {

    #time = 200; //ms

    #h1 = document.createElement('h1');

    #selected = -1;

    #onClicked = function(){};

    #ctn;

    constructor(){
        super();
    }

    Show(textos = [{texto: 'No', valor: 0}]){
        this.className = 'show';
        this.#ctn.innerHTML = '';

        for (let index = 0; index < textos.length; index++) {
            const div = document.createElement('div');
            div.className = 'btn-btn';
            div.innerText = textos[index].texto;

            div.onclick = async e => {
                this.#selected = textos[index].valor
                await this.#onClicked();
            }

            this.#ctn.appendChild(div);
        }

        return this.#response;
    }

    Hide(){
        this.className = 'hide';
        this.#ctn.innerHTML = '';
        return this.#response;
    }

    get Selected(){
        return this.#selected
    }

    get onClicked(){
        return this.#onClicked;
    }

    set onClicked(value){
        if(typeof value === 'function')
            this.#onClicked = value;
    }

    get Text(){
        return this.#h1.innerHTML;
    }

    set Text(value){
        this.#h1.innerHTML = value + '';
    }

    connectedCallback(){
        const exitbox = document.createElement('exit-box');
        const ctn = document.createElement('div');
        ctn.className = 'ctn-btn';
        exitbox.append(this.#h1, ctn);
        this.#ctn = ctn;
        this.append(exitbox);
    }

    disconnectedCallback(){
        this.innerHTML = '';
    }

    get #response(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.#time);
        });
    }

}

customElements.define("notify-one", NotifyOne);