class PlayerSound extends HTMLElement {

    /**
     * @type {HTMLElement}
     */
    #Content;
    /**
     * @type {HTMLInputElement}
     */
    #DurationInput;
    /**
     * @type {HTMLInputElement}
     */
    #VolumeInput;
    /**
     * @type {HTMLSpanElement}
     */
    #DurationSpan;

    /**
     * @type {HTMLAudioElement}
     */
    #Audio;

    /**
     * @type {DocumentFragment}
     */
    #DocumentFragment;

    /**
     * @type {HTMLElement}
     */
    #PlayPause;

    constructor(){
        super();

        let div = document.createElement('div');
        div.innerHTML = 
        `
        <div>
            <div>
                <div class="duration">
                    <input type="range">
                    <span>10:59</span>
                </div>
                <div class="volume">
                    <input type="range" min="0" max="1" step="0.1">
                    <span>
                        volume
                    </span>
                </div>
            </div>
            
            <div class="play-place">
                <i class="gg-play-button"></i>
            </div>
        </div>
        `;

        this.#Content = div.firstElementChild;
        div.removeChild(this.#Content);
        
        div = this.#Content.querySelectorAll('input');

        this.#DurationInput = div[0];
        this.#DurationInput.min = 0;
        this.#DurationInput.step = 1;
        this.#DurationInput.value = 0;

        this.#VolumeInput = div[1];
        this.#VolumeInput.value = 0;

        this.#PlayPause = this.#Content.querySelector('i');

        this.#DurationSpan = this.#Content.querySelector('span');
        this.#DurationSpan.innerText = '00:00';

        this.#Audio = new Audio();
        this.#VolumeInput.value = this.#Audio.volume;

        this.#Audio.onloadeddata = e => {
            this.#DurationInput.max = Math.floor(this.#Audio.duration);
            this.#DurationSpan.innerText = calculateTime(this.#Audio.duration);
            this.#VolumeInput.value = this.#Audio.volume;
        }

        this.#Audio.ontimeupdate = e => {
            this.#DurationSpan.innerText = calculateTime(this.#Audio.currentTime);
            this.#DurationInput.value = Math.floor(this.#Audio.currentTime);
        }

        this.#Audio.onended = e => {
            this.#PlayPause.className = 'gg-play-button';
            this.#DurationInput.value = Math.floor(this.#Audio.duration);
        }

        this.#Audio.onerror = e => {
            if(window.Xam)
                console.error(this.#Audio.error, this.#Audio.src);
            else
                alert(this.#Audio.error.toString() + this.#Audio.src);

            this.#PlayPause.className = 'gg-play-button';
        }

        this.#DurationInput.onchange = e => {
            this.#Audio.currentTime = parseInt(this.#DurationInput.value);
        }

        this.#VolumeInput.onchange = e => {
            this.#Audio.volume = parseFloat(this.#VolumeInput.value);
        }

        this.#PlayPause.onclick = async e => {

            if(this.#PlayPause.className == 'gg-play-button'){
                await this.Play();
                console.log('PLAY');
                return 
            }
                

            this.Pause();
        }
        
    }

    get src(){
        return this.#Audio.src;
    }

    set src(value){
        this.#Audio.src = value + '';
    }

    async Play(){
        await this.#Audio.play();
        this.#PlayPause.className = 'gg-play-pause';
    }

    Pause(){
        this.#Audio.pause();
        this.#PlayPause.className = 'gg-play-button';
    }

    Stop(){
        this.Pause();
        this.#Audio.currentTime = 0;
    }

    get Volume(){
        return this.#Audio.volume * 100;
    }

    set Volume(value){
        value = parseInt(value);

        if(isNaN(value))
            return;

        if(value < 0)
            value = 0;
        
        if(value > 100)
            value = 100;

        this.#Audio.volume = value;
        this.#VolumeInput.value = value;
    }

    connectedCallback(){
        this.#DocumentFragment = document.createDocumentFragment();
        this.#DocumentFragment.append(this.#Audio);
        this.append(this.#Content);
    }
 
    disconnectedCallback(){
        this.#Content.remove();
        this.#DocumentFragment.removeChild(this.#Audio);
        this.#DocumentFragment = null;
    }

}

customElements.define("player-sound", PlayerSound);

function calculateTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}