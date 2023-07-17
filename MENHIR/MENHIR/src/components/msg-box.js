class MsgBox extends HTMLElement {

    #time = 200; //ms

    constructor(){
        super();
    }

    Show(text, time = 2000){
        this.innerHTML = text + '';
        this.className = 'show';
        setTimeout(() => {
            this.Hide();
        }, time);
        return this.#response;
    }

    Hide(){
        this.className = 'hide';
        return this.#response;
    }

    get #response(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.#time);
        });
    }

}

customElements.define("msg-box", MsgBox);