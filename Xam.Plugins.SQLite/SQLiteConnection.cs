using SQLitePCL;
using System;
using System.Collections.Generic;
using System.Text;

/*
 Copyright (c) 2023, Emanuel Rojas Vásquez - MIT
 https://github.com/erovas
*/
namespace Xam.Plugins.SQLite
{
    public class SQLiteConnection : IDisposable
    {
        private const string PREFIX = "@";

        static SQLiteConnection()
        {
            SQLitePCL.Batteries_V2.Init();
        }

        private sqlite3 Handle { get; set; }
        private int LibVersionNumber { get; set; }

        #region PUBLIC PROPERTIES

        public bool Disposed { get; private set; }

        private bool _IsOpen;
        public bool IsOpen
        {
            get
            {
                AUX_ThrowDisposedException();
                return _IsOpen;
            }
            private set => _IsOpen = value;
        }

        private bool _IsTransaction;
        public bool IsTransaction
        {
            get
            {
                AUX_ThrowDisposedException();
                return _IsTransaction;
            }
            private set => _IsTransaction = value;
        }

        private string _DatabasePath;
        public string DatabasePath
        {
            get => _DatabasePath;
            set
            {
                AUX_ThrowDisposedException();
                if (this.IsOpen)
                    return;

                _DatabasePath = value;
            }
        }

        private int _Timeout = 30;  // 30 segundos por defecto
        public int Timeout
        {
            get => _Timeout;
            set
            {
                AUX_ThrowDisposedException();
                if (value <= 0)
                    _Timeout = 0;
                else
                    _Timeout = value;

                if(this.IsOpen)
                    SQLite3.BusyTimeout(this.Handle, _Timeout);
            }
        }

        #endregion

        #region CONSTRUCTORS

        public SQLiteConnection() 
        {
            this.LibVersionNumber = SQLite3.LibVersionNumber();
        }

        public SQLiteConnection(string databasePath) : this()
        {
            this.DatabasePath = databasePath;
        }

        #endregion

        public void Open()
        {
            AUX_ThrowDisposedException();

            if (this.IsOpen)
                throw new Exception("Connection is already open");

            SQLite3.Result result = SQLite3.Open(this.DatabasePath, out sqlite3 db, (int)(0x2 | 0x4), null);
            this.Handle = db;

            if (result != 0)
                throw new SQLiteException(result, $"Could not open database file: {this.DatabasePath} ({result})");

            SQLite3.BusyTimeout(this.Handle, this.Timeout);
            this.IsOpen = true;

        }

        public void Close()
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            Dispose(true);
        }

        #region TRANSACTIONS

        public void BeginTransaction()
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();

            if (this.IsTransaction)
                throw new Exception("Transaction has already been started");

            ExecuteNonQuery("begin transaction");
            this.IsTransaction = true;
        }

        public void CommitTransaction()
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            AUX_ThrowIsNotTransaction();

            ExecuteNonQuery("commit");
            this.IsTransaction = false;
        }

        public void RollbackTransaction()
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            AUX_ThrowIsNotTransaction();

            ExecuteNonQuery("rollback");
            this.IsTransaction = false;
        }

        #endregion

        #region EXECUTERS

        public int ExecuteNonQuery(string query)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            return AUX_ExecuteNonQuery(statement, this.Handle);
        }

        public int ExecuteNonQuery(string query, Dictionary<string, object> parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteNonQuery(statement, this.Handle);
        }

        public int ExecuteNonQuery(string query, object[] parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteNonQuery(statement, this.Handle);
        }

        //===================================//
        //===================================//

        public object ExecuteEscalar(string query)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            return AUX_ExecuteEscalar(statement, this.Handle);
        }

        public object ExecuteEscalar(string query, Dictionary<string, object> parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteEscalar(statement, this.Handle);
        }

        public object ExecuteEscalar(string query, object[] parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteEscalar(statement, this.Handle);
        }

        //===================================//
        //===================================//

        public IReadOnlyDictionary<string, object>[] ExecuteData(string query)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            return AUX_ExecuteData(statement, this.Handle);
        }

        public IReadOnlyDictionary<string, object>[] ExecuteData(string query, Dictionary<string, object> parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteData(statement, this.Handle);
        }

        public IReadOnlyDictionary<string, object>[] ExecuteData(string query, object[] parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteData(statement, this.Handle);
        }

        //===================================//
        //===================================//

        public IEnumerable<IReadOnlyDictionary<string, object>> ExecuteReader(string query)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            return AUX_ExecuteReader(statement, this.Handle);
        }

        public IEnumerable<IReadOnlyDictionary<string, object>> ExecuteReader(string query, Dictionary<string, object> parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteReader(statement, this.Handle);
        }

        public IEnumerable<IReadOnlyDictionary<string, object>> ExecuteReader(string query, object[] parameters)
        {
            AUX_ThrowDisposedException();
            AUX_ThrowIsNotOpen();
            var statement = SQLite3.Prepare2(this.Handle, query);
            AUX_SetParameters(statement, parameters);
            return AUX_ExecuteReader(statement, this.Handle);
        }

        #endregion

        #region DISPOSE

        private void Dispose(bool disposing)
        {
            if (this.Disposed)
                return;

            if(!this.IsOpen || this.Handle == null)
                return;

            bool flag = LibVersionNumber >= 3007014;

            try
            {
                if (disposing)
                {
                    SQLite3.Result result = (flag ? SQLite3.Close2(Handle) : SQLite3.Close(Handle));
                    if (result != 0)
                    {
                        string errmsg = SQLite3.GetErrmsg(Handle);
                        throw new SQLiteException(result, errmsg);
                    }
                }
                else if (flag)
                    SQLite3.Close2(Handle);
                
                else
                    SQLite3.Close(Handle);
                
            }
            finally
            {
                this.Handle = null; 
                this.IsOpen = false;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
            this.Disposed = true;
        }

        ~SQLiteConnection() 
        {
            Dispose(false);
            this.Disposed = true;
        }

        #endregion

        #region HELPERS

        private static int AUX_ExecuteNonQuery(sqlite3_stmt statement, sqlite3 connection)
        {
            try
            {
                SQLite3.Result result = SQLite3.Step(statement);

                switch (result)
                {
                    case SQLite3.Result.Done:
                        return SQLite3.Changes(connection);

                    case SQLite3.Result.Error:
                        string errmsg = SQLite3.GetErrmsg(connection);
                        throw new SQLiteException(result, errmsg);
                        
                    case SQLite3.Result.Constraint:
                        if (SQLite3.ExtendedErrCode(connection) == SQLite3.ExtendedResult.ConstraintNotNull)
                            throw new NotNullConstraintViolationException(result, SQLite3.GetErrmsg(connection));

                        break;
                }

                throw new SQLiteException(result, SQLite3.GetErrmsg(connection));
            }
            finally
            {
                SQLite3.Finalize(statement);
            }

        }

        private static object AUX_ExecuteEscalar(sqlite3_stmt statement, sqlite3 connection)
        {
            try
            {
                SQLite3.Result result = SQLite3.Step(statement);
                switch (result)
                {
                    case SQLite3.Result.Row:
                        return AUX_GetColumnValue(statement, 0);

                    case SQLite3.Result.Done:
                        return null;

                    case SQLite3.Result.Error:
                        throw new SQLiteException(result, SQLite3.GetErrmsg(connection));

                    case SQLite3.Result.Constraint:
                        if (SQLite3.ExtendedErrCode(connection) == SQLite3.ExtendedResult.ConstraintNotNull)
                            throw new NotNullConstraintViolationException(result, SQLite3.GetErrmsg(connection));

                        break;
                }

                throw new SQLiteException(result, SQLite3.GetErrmsg(connection));
            }
            finally
            {
                SQLite3.Finalize(statement);
            }
        }

        private static IReadOnlyDictionary<string, object>[] AUX_ExecuteData(sqlite3_stmt statement, sqlite3 connection)
        {
            try
            {
                SQLite3.Result result = SQLite3.Step(statement);
                switch (result)
                {
                    case SQLite3.Result.Row:
                        var columns = SQLite3.ColumnCount(statement);
                        var resultTemp = new List<Dictionary<string, object>>();

                        do
                        {
                            var row = new Dictionary<string, object>();
                            for (var i = 0; i < columns; i++)
                            {
                                var name = SQLite3.ColumnName(statement, i);
                                object value = AUX_GetColumnValue(statement, i);
                                row[name] = value;
                            }

                            resultTemp.Add(row);
                        } while (SQLite3.Step(statement) == SQLite3.Result.Row);

                        var resultFinal = new IReadOnlyDictionary<string, object>[resultTemp.Count];

                        for (int i = 0; i < resultTemp.Count; i++)
                            resultFinal[i] = resultTemp[i];

                        resultTemp.Clear();

                        return resultFinal;
                        
                    case SQLite3.Result.Done:
                        return null;

                    case SQLite3.Result.Error:
                        throw new SQLiteException(result, SQLite3.GetErrmsg(connection));

                    case SQLite3.Result.Constraint:
                        if (SQLite3.ExtendedErrCode(connection) == SQLite3.ExtendedResult.ConstraintNotNull)
                            throw new NotNullConstraintViolationException(result, SQLite3.GetErrmsg(connection));

                        break;
                }

                throw new SQLiteException(result, SQLite3.GetErrmsg(connection));
            }
            finally
            {
                SQLite3.Finalize(statement);
            }
        }

        private static IEnumerable<IReadOnlyDictionary<string, object>> AUX_ExecuteReader(sqlite3_stmt statement, sqlite3 connection)
        {
            try
            {
                SQLite3.Result result = SQLite3.Step(statement);
                switch (result)
                {
                    case SQLite3.Result.Row:                        
                        var columns = SQLite3.ColumnCount(statement);

                        do
                        {
                            var row = new Dictionary<string, object>();
                            for (var i = 0; i < columns; i++)
                            {
                                var name = SQLite3.ColumnName(statement, i);
                                object value = AUX_GetColumnValue(statement, i);
                                row[name] = value;
                            }

                            yield return row;
                        } while (SQLite3.Step(statement) == SQLite3.Result.Row);
                            
                        break;

                    case SQLite3.Result.Done:
                        yield return null;
                        break;

                    case SQLite3.Result.Error:
                        throw new SQLiteException(result, SQLite3.GetErrmsg(connection));

                    case SQLite3.Result.Constraint:
                        if (SQLite3.ExtendedErrCode(connection) == SQLite3.ExtendedResult.ConstraintNotNull)
                            throw new NotNullConstraintViolationException(result, SQLite3.GetErrmsg(connection));

                        break;

                    default:
                        throw new SQLiteException(result, SQLite3.GetErrmsg(connection));
                }
            }
            finally
            {
                SQLite3.Finalize(statement);
            }
        }

        private void AUX_ThrowDisposedException()
        {
            if (this.Disposed)
                throw new ObjectDisposedException(this.GetType().Name);
        }

        private void AUX_ThrowIsNotOpen()
        {
            if (this.IsOpen)
                return;

            throw new Exception("Connection is no open");
        }

        private void AUX_ThrowIsNotTransaction()
        {
            if (this.IsTransaction)
                return;

            throw new Exception("Transaction not started");
        }

        private static void AUX_SetParameters(sqlite3_stmt statement, Dictionary<string, object> parameters)
        {
            int index;

            foreach (var item in parameters)
            {
                index = SQLite3.BindParameterIndex(statement, PREFIX + item.Key);
                AUX_BindParameter(statement, index, item.Value);
            }
        }

        private static void AUX_SetParameters(sqlite3_stmt statement, object[] parameters)
        {
            for (int i = 0; i < parameters.Length; i++)
                AUX_BindParameter(statement, i, parameters[i]);
        }

        private static void AUX_BindParameter(sqlite3_stmt statement, int index, object value)
        {
            var NegativePointer = new IntPtr(-1);
            if (value == null)
            {
                SQLite3.BindNull(statement, index);
                return;
            }

            if (value is int)
            {
                SQLite3.BindInt(statement, index, (int)value);
                return;
            }

            if (value is string)
            {
                SQLite3.BindText(statement, index, (string)value, -1, NegativePointer);
                return;
            }

            if (value is byte || value is ushort || value is sbyte || value is short)
            {
                SQLite3.BindInt(statement, index, Convert.ToInt32(value));
                return;
            }

            if (value is bool)
            {
                SQLite3.BindInt(statement, index, ((bool)value) ? 1 : 0);
                return;
            }

            if (value is uint || value is long)
            {
                SQLite3.BindInt64(statement, index, Convert.ToInt64(value));
                return;
            }

            if (value is float || value is double || value is decimal)
            {
                SQLite3.BindDouble(statement, index, Convert.ToDouble(value));
                return;
            }

            if (value is TimeSpan)
            {
                SQLite3.BindInt64(statement, index, ((TimeSpan)value).Ticks);
                return;
            }

            if (value is DateTime)
            {
                SQLite3.BindInt64(statement, index, ((DateTime)value).Ticks);
                return;
            }

            if (value is DateTimeOffset)
            {
                SQLite3.BindInt64(statement, index, ((DateTimeOffset)value).UtcTicks);
                return;
            }

            if (value is byte[])
            {
                SQLite3.BindBlob(statement, index, (byte[])value, ((byte[])value).Length, NegativePointer);
                return;
            }

            if (value is Guid)
            {
                SQLite3.BindText(statement, index, ((Guid)value).ToString(), 72, NegativePointer);
                return;
            }

            if (value is Uri)
            {
                SQLite3.BindText(statement, index, ((Uri)value).ToString(), -1, NegativePointer);
                return;
            }

            if (value is StringBuilder)
            {
                SQLite3.BindText(statement, index, ((StringBuilder)value).ToString(), -1, NegativePointer);
                return;
            }

            if (value is UriBuilder)
            {
                SQLite3.BindText(statement, index, ((UriBuilder)value).ToString(), -1, NegativePointer);
                return;
            }

            if (value is Enum)
            {
                SQLite3.BindInt(statement, index, Convert.ToInt32(value));
                return;
            }

            throw new NotSupportedException("Cannot store type: " + value.GetType().FullName);
        }

        private static object AUX_GetColumnValue(sqlite3_stmt statement, int index)
        {
            SQLite3.ColType columnType = SQLite3.ColumnType(statement, index);
            object value = null;

            switch (columnType)
            {
                case SQLite3.ColType.Integer:
                    value = SQLite3.ColumnInt(statement, index);
                    break;
                case SQLite3.ColType.Float:
                    value = SQLite3.ColumnDouble(statement, index);
                    break;
                case SQLite3.ColType.Text:
                    value = SQLite3.ColumnText(statement, index);
                    break;
                case SQLite3.ColType.Blob:
                    value = SQLite3.ColumnBlob(statement, index);
                    break;
                case SQLite3.ColType.Null:
                    value = null;
                    break;
            }

            return value;
        }

        #endregion

    }
}