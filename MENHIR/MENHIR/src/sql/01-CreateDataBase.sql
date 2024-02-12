CREATE TABLE "Accepted" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Response"	INTEGER NOT NULL
);

CREATE TABLE "StoryTypes" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	TEXT NOT NULL UNIQUE
);

CREATE TABLE "Genders" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	INTEGER NOT NULL UNIQUE
);

CREATE TABLE "Users" (
    /* "ID"	    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, */
    "ID"	    TEXT NOT NULL PRIMARY KEY UNIQUE,
    "IDGender"	INTEGER NOT NULL,
    "Date"	    INTEGER NOT NULL,
    "Username"	TEXT NOT NULL,
    "Age"		INTEGER NOT NULL,
    "Password"	TEXT NOT NULL,
    "Phrase"    TEXT NOT NULL,
    FOREIGN KEY("IDGender") REFERENCES "Genders"("ID")
);

CREATE TABLE "Wellbeings" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	TEXT NOT NULL UNIQUE,
    "Description"	TEXT NOT NULL
);

CREATE TABLE "HobbiesConnect" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	        TEXT NOT NULL
);

CREATE TABLE "UserHobbiesConnect" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"        INTEGER NOT NULL, */
    "IDUser"        TEXT NOT NULL,
    "IDHobby"       INTEGER NOT NULL,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDHobby") REFERENCES "HobbiesConnect"("ID")
);

CREATE TABLE "HobbiesBeActive" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	        TEXT NOT NULL
);

CREATE TABLE "UserHobbiesBeActive" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"        INTEGER NOT NULL, */
    "IDUser"        TEXT NOT NULL,
    "IDHobby"       INTEGER NOT NULL,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDHobby") REFERENCES "HobbiesBeActive"("ID")
);

CREATE TABLE "HobbiesKeepLearning" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	        TEXT NOT NULL
);

CREATE TABLE "UserHobbiesKeepLearning" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"        INTEGER NOT NULL, */
    "IDUser"        TEXT NOT NULL,
    "IDHobby"       INTEGER NOT NULL,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDHobby") REFERENCES "HobbiesKeepLearning"("ID")
);

CREATE TABLE "HobbiesGive" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	        TEXT NOT NULL
);

CREATE TABLE "UserHobbiesGive" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"        INTEGER NOT NULL, */
    "IDUser"        TEXT NOT NULL,
    "IDHobby"       INTEGER NOT NULL,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDHobby") REFERENCES "HobbiesGive"("ID")
);

CREATE TABLE "HobbiesTakeNotice" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	        TEXT NOT NULL
);

CREATE TABLE "UserHobbiesTakeNotice" (
    "ID"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"        INTEGER NOT NULL, */
    "IDUser"        TEXT NOT NULL,
    "IDHobby"       INTEGER NOT NULL,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDHobby") REFERENCES "HobbiesTakeNotice"("ID")
);

CREATE TABLE "Moods" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Name"	TEXT NOT NULL UNIQUE,
    "Filename"	TEXT
);

CREATE TABLE "MoodAnswers" (
    "ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "Type"	TEXT,
    "Description" Text
);

CREATE TABLE "UserStories" (
    "ID"	            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    /* "IDUser"	        INTEGER NOT NULL, */
    "IDUser"            TEXT NOT NULL,
    "IDStoryType"	    INTEGER NOT NULL,
    "IDMoodBefore"	    INTEGER,
    "IDAnswerBefore"	INTEGER,
    "IDMoodAfter"	    INTEGER,
    "IDAnswerAfter"	    INTEGER,
    "Date"	            INTEGER NOT NULL,
    "Title"	            TEXT,
    "Text"	            TEXT,
    "Source"	        TEXT,
    "Suggested"         TEXT,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDStoryType") REFERENCES "StoryTypes"("ID"),
    FOREIGN KEY("IDMoodBefore") REFERENCES "Moods"("ID"),
    FOREIGN KEY("IDAnswerBefore") REFERENCES "MoodAnswers"("ID"),
    FOREIGN KEY("IDMoodAfter") REFERENCES "Moods"("ID"),
    FOREIGN KEY("IDAnswerAfter") REFERENCES "MoodAnswers"("ID")
);

CREATE TABLE "UserNotification" (
    "ID"	            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    "IDUser"            TEXT NOT NULL,
    "IDStory"           INTEGER NOT NULL,
    "TableName"         TEXT,
    "HobbiesIDs"        TEXT,
    "Date"	            INTEGER NOT NULL,
    "DateResponse"	    INTEGER,
    "IDHobbyResponse"   INTEGER,
    "FeelResponse"      INTEGER,
    FOREIGN KEY("IDUser") REFERENCES "Users"("ID"),
    FOREIGN KEY("IDStory") REFERENCES "UserStories"("ID")
)