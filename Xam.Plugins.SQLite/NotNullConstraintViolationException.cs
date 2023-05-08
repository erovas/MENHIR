/*
 https://github.com/praeclarum/sqlite-net
*/
namespace Xam.Plugins.SQLite
{
    public class NotNullConstraintViolationException : SQLiteException
    {
        public NotNullConstraintViolationException(SQLite3.Result r, string message) : base(r, message)
        {
        }
    }
}