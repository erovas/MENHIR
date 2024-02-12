const Controls = {
    /**
     * @type {HTMLDivElement}
     */
    ContainerList: null,

    /**
     * @type {HTMLElement}
     */
    ViewText: null,

    /**
     * @type {HTMLElement}
     */
    ViewAudio: null,

    /**
     * @type {import('../js/TypesDef').HTMLPlayerSoundElement}
     */
    PlayerSound: null,
}

/**
 * @type {{ID: Number, Name: String}[]}
 */
let MoodsEntities = [];

/**
 * @type {String[]}
 */
let MoodsIcons = [];

/**
 * Obtiene la lista de los Moods (Ids y emojis)
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 */
async function GetMoodsEntities(MH){
    const sql = 
    `
        SELECT 
            ID,
            Name
        FROM Moods
        ORDER BY ID ASC
    `;

    await MH.SQLite.Open();
    MoodsEntities = await MH.SQLite.ExecuteData(sql);
    await MH.SQLite.Close();

    const cssVars = MH.Window.getComputedStyle(document.querySelector(':root'));

    for (let i = 0; i < MoodsEntities.length; i++) {
        const entity = MoodsEntities[i];
        MoodsIcons.push(cssVars.getPropertyValue(`--mood-${entity.Name.replaceAll(' ', '').toLocaleLowerCase()}`));
    }
}

const TextView = {

    _h2: null,
    _h3: null,
    _closer: null,

    /**
     * 
     * @param {import('../js/TypesDef.js').MENHIR} MH 
     * @param {import('../js/TypesDef.js').StoryEntity} story 
     */
    Show(MH, story){
        this._h2.innerText = story.Title;
        this._h3.innerText = story.Text;
        Controls.ViewText.className = 'show';
    }
}

const AudioView = {
    _h2: null,
    _closer: null,

    /**
     * 
     * @param {import('../js/TypesDef.js').MENHIR} MH 
     * @param {import('../js/TypesDef.js').StoryEntity} story 
     */
    async Show(MH, story){
        this._h2.innerText = story.Title;

        if(MH.Window.location.protocol.includes('http')){
            const base64 = await MH.Xam.ReadFileBase64(story.Source);
            Controls.PlayerSound.src = 'data:audio/wav;base64,' + base64;
        }
        else
            Controls.PlayerSound.src = story.Source;

        Controls.ViewAudio.className = 'show';
    }
}

function ConfigViewers(){

    TextView._h2 = Controls.ViewText.querySelector('h2');
    TextView._h3 = Controls.ViewText.querySelector('h3');
    TextView._closer = Controls.ViewText.querySelector('div[class="closer"]');

    TextView._closer.onclick = e => {
        Controls.ViewText.className = 'hide';
        TextView._h2.innerText = '';
        TextView._h3.innerText = '';
    }

    AudioView._h2 = Controls.ViewAudio.querySelector('h2');
    AudioView._closer = Controls.ViewAudio.querySelector('div[class="closer"]');

    AudioView._closer.onclick = e => {
        Controls.PlayerSound.Stop();
        Controls.ViewAudio.className = 'hide';
        AudioView._h2.innerText = '';
    }
}

export { Constructor, Controls }

/**
 * Constructor de la pantalla
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {HTMLElement} root 
 */
async function Constructor(MH, root){
    const User = MH.User;
    const MsgWarning = MH.Components.MsgWarning;
    const BackButton = MH.Components.BackButton;
    const NextButton = MH.Components.NextButton;
    const Story = User.Story;

    //Indica que se va hacer "Another action"
    const IsFinish = Story.ID > 0;

    if(IsFinish){
        Story.Clear();
        Story.IDUser = User.ID;
    }

    await GetMoodsEntities(MH);

    //Rellenar lista con las ultimas Stories (desde 7 dias atras)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    //const stories = await GetStoriesByDate(MH, sevenDaysAgo, Date.now())
    const stories = await GetStoriesByDate(MH, 0, Date.now(), MH.User.ID);
    await SetDOMList(MH, stories);

    ConfigViewers();

    BackButton.onclick = e => {
        MH.GoTo(MH.Routes.Welcome);
    }

    NextButton.onclick = e => {
        Story.IDStoryType = MH.StoryType.Review;
        MH.GoTo(MH.Routes.AnotherAction);
    }

    //BackButton.Show();  // Comentar/Quitar en release
    NextButton.Show();
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {Date} dateFrom 
 * @param {Date} dateTo 
 * @param {String} IDUser 
 * @returns {@returns {import('../js/TypesDef.js').StoryEntity[]}}
 */
async function GetStoriesByDate(MH, dateFrom, dateTo, IDUser){
    const sql =
    `
        SELECT
            ID,
            IDUser,
            IDStoryType,
            IDMoodBefore,
            IDAnswerBefore,
            IDMoodAfter,
            IDAnswerAfter,
            Date,
            Title,
            Text,
            Source
        FROM UserStories
        WHERE Date BETWEEN @dateFrom AND @dateTo
        AND IDUser = @IDUser
        ORDER BY ID DESC
    `;

    if(dateFrom instanceof Date)
        dateFrom = dateFrom.getTime();

    if(dateTo instanceof Date)
        dateTo = dateTo.getDate();

    const parameters = { 
        dateFrom, 
        dateTo,
        IDUser
    };

    await MH.SQLite.Open();
    const response = await MH.SQLite.ExecuteData(sql, parameters);
    await MH.SQLite.Close();

    return response;
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {String} title 
 * @returns {import('../js/TypesDef.js').StoryEntity[]}
 */
async function GetStoriesByTitle(MH, title){
    const sql =
    `
        SELECT
            ID,
            IDUser,
            IDStoryType,
            IDMoodBefore,
            IDAnswerBefore,
            IDMoodAfter,
            IDAnswerAfter,
            Date,
            Title,
            Text,
            Source
        FROM UserStories
        WHERE Title LIKE @title
        ORDER BY ID DESC
    `;

    const parameters = { title: '%' + title + '%' };

    await MH.SQLite.Open();
    const response = await MH.SQLite.ExecuteData(sql, parameters);
    await MH.SQLite.Close();

    return response;
}

/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {Number} IDMoodBefore 
 * @returns {import('../js/TypesDef.js').StoryEntity[]}
 */
async function GetStoriesByMood(MH, IDMoodBefore){
    const sql =
    `
        SELECT
            ID,
            IDUser,
            IDStoryType,
            IDMoodBefore,
            IDAnswerBefore,
            IDMoodAfter,
            IDAnswerAfter,
            Date,
            Title,
            Text,
            Source
        FROM UserStories
        WHERE IDMoodBefore = IDMoodBefore
        ORDER BY ID DESC
    `;

    const parameters = { IDMoodBefore };

    await MH.SQLite.Open();
    const response = await MH.SQLite.ExecuteData(sql, parameters);
    await MH.SQLite.Close();

    return response;
}


/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {import('../js/TypesDef.js').StoryEntity} Story 
 * @returns 
 */
async function OpenViewStory(MH, Story){

    if(Story.IDStoryType == MH.StoryType.Audio)
        return AudioView.Show(MH, Story);
    
    TextView.Show(MH, Story);
}




/**
 * 
 * @param {import('../js/TypesDef.js').MENHIR} MH 
 * @param {import('../js/TypesDef.js').StoryEntity[]} stories 
 */
async function SetDOMList(MH, stories){
    // Limpiar la lista del DOM
    Controls.ContainerList.innerHTML = '';

    const document = MH.Document;
    const dummy = document.createElement('div');

    const OnClick = async function(e) {
        const Story = this.Story;
        await OpenViewStory(MH, Story);
    }

    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];

        if(story.Title == null)
            continue;

        dummy.innerHTML = 
        `
            <div class="story-container">
                <div class="data">
                    <h2>Titulo muy largo de ver por tanto algo debe pasar</h2>
                    <div class="meta-data">
                        <h3>12/11/2020</h3>
                        <span>😢</span>
                    </div>
                </div>
                <div class="play">
                    <i class="gg-play-button"></i>
                </div>
            </div>
        `;
        const item = dummy.firstElementChild;
        const titleH2 = item.querySelector('h2');
        const dateH3 = item.querySelector('h3');
        const moodSpan = item.querySelector('span');
        const btnPlay = item.querySelector('div[class="play"]');
        
        titleH2.innerText = story.Title;
        dateH3.innerText = DateToString(story.Date);
        moodSpan.innerText = MoodsIcons[story.IDMoodBefore - 1];
        btnPlay.Story = story;
        btnPlay.onclick = OnClick;
        Controls.ContainerList.append(item);
    }

}

/**
 * 
 * @param {Date | Number} date 
 * @returns {String} - MM/DD/YYYY hh:mm:ss
 */
function DateToString(date){
    
    if(typeof date == 'number')
        date = new Date(date);

    let yyyy = date.getFullYear();
    let MM = fnt( date.getMonth() + 1 );
    let dd = fnt( date.getDate() );

    let hh = fnt( date.getHours() );
    let mm = fnt( date.getMinutes() );
    let ss = fnt( date.getSeconds() );

    return `${MM}/${dd}/${yyyy} ${hh}:${mm}:${ss}`;
}

function fnt(n){
    if(n < 10) 
        n = "0" + n;
    return n+"";
}