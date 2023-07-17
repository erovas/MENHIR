class SimpleSlider extends HTMLElement {

    #time = 400; //ms
    #Roll = document.createElement('simple-roll');
    /**
     * @type {HTMLCollectionOf<HTMLElement>}
     */
    #Slides;

    constructor(){
        super();
    }

    get Slides(){
        return this.#Slides;
    }

    get Count(){
        return this.#Slides.length;
    }

    get Index(){
        if(this.Count == 0)
            return -1;

        const realIndex = - parseInt(this.Slides[0].style.marginLeft || 0) / this.offsetWidth;
        return realIndex;
    }

    set Index(value){
        value = parseInt(value);
        this.#GoToSlide(value);
    }

    /**
     * 
     * @param {HTMLElement | String} [content]
     * @returns 
     */
    AddSlide(content){
        const slide = document.createElement('simple-slide');
        
        if(typeof content == 'string')
            slide.innerHTML = content;
        if(content instanceof HTMLElement)
            slide.append(content);

        this.#Roll.append(slide);
        return slide;
    }

    async RemoveSlide(index){
        if(index < 0 || index > this.Count - 1)
            return null;

        const slide = this.#Slides[index];
        slide.remove();
        await this.#response;
        return slide;
    }

    NextSlide(){
        return this.#GoToSlide(this.Index + 1);
    }

    PrevSlide(){
        return this.#GoToSlide(this.Index - 1);
    }

    connectedCallback(){
        this.append(this.#Roll);
        this.#Slides = this.#Roll.getElementsByTagName('simple-slide');
    }
 
    disconnectedCallback(){
        this.#Roll.remove();
    }

    get #response(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.#time);
        });
    }

    #GoToSlide(index){

        if(this.Count == 0)
            return new Promise((resolve, reject) => resolve());
    
        if(index < 0)
            index = this.Count - 1;
        else if(index > this.Count - 1)
            index = 0;

        //this.#Slides[0].style.transitionDuration = this.#Transition + 's';
        this.#Slides[0].style.marginLeft = '-' + index * this.offsetWidth + 'px';

        return this.#response;
    }

}

customElements.define("simple-slider", SimpleSlider);