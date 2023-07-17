class ExitAlert extends HTMLElement {

    #time = 200; //ms
    #yes = document.createElement('div');
    #no = document.createElement('div');
    #h1 = document.createElement('h1');

    constructor(){
        super();

        this.#yes.className = 'btn-btn';
        this.#no.className = 'btn-btn';

        this.#yes.innerText = 'Yes';
        this.#no.innerText = 'No';
    }

    Show(){
        this.className = 'show';
        return this.#response;
    }

    Hide(){
        this.className = 'hide';
        return this.#response;
    }


    get onclickYes(){
        return this.#yes.onclick;
    }
    set onclickYes(value){
        this.#yes.onclick = value;
    }

    get onclickNo(){
        return this.#no.onclick;
    }
    set onclickNo(value){
        this.#no.onclick = value;
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
        ctn.append(this.#no, this.#yes);
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

customElements.define("exit-alert", ExitAlert);