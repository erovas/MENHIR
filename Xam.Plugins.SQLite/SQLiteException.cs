using System;

/*
 https://github.com/praeclarum/sqlite-net
*/
namespace Xam.Plugins.SQLite
{
    public class SQLiteException : Exception
    {
        public SQLite3.Result Result { get; }

        public SQLiteException(SQLite3.Result r, string message) : base(message)
        {
            Result = r;
        }
    }
}
