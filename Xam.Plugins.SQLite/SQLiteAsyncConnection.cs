using System.Collections.Generic;
using System.Threading.Tasks;

/*
 Copyright (c) 2023, Emanuel Rojas Vásquez - MIT
 https://github.com/erovas
*/
namespace Xam.Plugins.SQLite
{
    public class SQLiteAsyncConnection
    {
        private SQLiteConnection Connection { get; set; }

        #region PUBLIC PROPERTIES

        public Task<bool> GetDisposed()
        {
            return Task.Factory.StartNew(delegate
            { 
                return Connection.Disposed; 
            });
        }

        public Task<bool> GetIsOpen()
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.IsOpen;
            });
        }

        public Task<bool> GetIsTransaction()
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.IsTransaction;
            });
        }

        public Task<string> GetDatabasePath()
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.DatabasePath;
            });
        }

        public Task SetDatabasePath(string value)
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.DatabasePath = value;
                return;
            });
        }

        public Task<int> GetTimeout()
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.Timeout;
            });
        }

        public Task SetTimeout(int value)
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.Timeout = value;
                return;
            });
        }

        #endregion

        #region CONSTRUCTORS

        public SQLiteAsyncConnection() 
        {
            this.Connection = new SQLiteConnection();
        }

        public SQLiteAsyncConnection(string databasePath) : this() 
        {
            this.Connection.DatabasePath = databasePath;
        }

        #endregion

        public Task Open()
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.Open();
                return;
            });
        }

        public Task Close()
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.Close();
                return;
            });
        }

        #region TRANSACTIONS

        public Task BeginTransaction()
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.BeginTransaction();
                return;
            });
        }

        public Task CommitTransaction()
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.CommitTransaction();
                return;
            });
        }

        public Task RollbackTransaction()
        {
            return Task.Factory.StartNew(delegate
            {
                Connection.RollbackTransaction();
                return;
            });
        }

        #endregion

        #region EXECUTERS

        public Task<int> ExecuteNonQuery(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteNonQuery(query);
            });
        }

        public Task<int> ExecuteNonQuery(string query, Dictionary<string, object> parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteNonQuery(query, parameters);
            });
        }

        public Task<int> ExecuteNonQuery(string query, object[] parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteNonQuery(query, parameters);
            });
        }

        //===================================//
        //===================================//

        public Task<object> ExecuteEscalar(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteEscalar(query);
            });
        }

        public Task<object> ExecuteEscalar(string query, Dictionary<string, object> parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteEscalar(query, parameters);
            });
        }

        public Task<object> ExecuteEscalar(string query, object[] parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteEscalar(query, parameters);
            });
        }

        //===================================//
        //===================================//

        public Task<IReadOnlyDictionary<string, object>[]> ExecuteData(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteData(query);
            });
        }

        public Task<IReadOnlyDictionary<string, object>[]> ExecuteData(string query, Dictionary<string, object> parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteData(query, parameters);
            });
        }

        public Task<IReadOnlyDictionary<string, object>[]> ExecuteData(string query, object[] parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteData(query, parameters);
            });
        }

        //===================================//
        //===================================//

        public Task<IEnumerable<IReadOnlyDictionary<string, object>>> ExecuteReader(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteReader(query);
            });
        }

        public Task<IEnumerable<IReadOnlyDictionary<string, object>>> ExecuteReader(string query, Dictionary<string, object> parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteReader(query, parameters);
            });
        }

        public Task<IEnumerable<IReadOnlyDictionary<string, object>>> ExecuteReader(string query, object[] parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                return Connection.ExecuteReader(query, parameters);
            });
        }

        #endregion

        #region DISPOSE

        public Task Dispose()
        {
            return Task.Factory.StartNew(delegate
            {
                this.Connection.Dispose();
                return;
            });
        }

        #endregion

    }
}