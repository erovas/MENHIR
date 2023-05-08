using MENHIR.Utils;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xam.Plugins.SQLite;

namespace MENHIR.Helpers
{
    public class SQLiteHelper
    {
        private SQLiteConnection Connection { get; set; }

        public SQLiteHelper(string databasePath)
        {
            this.Connection = new SQLiteConnection(databasePath);
            this.Connection.Open();
        }

        #region EXECUTERS

        public Task<Response<int>> ExecuteNonQuery(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                try
                {
                    return Response<int>.Result(this.Connection.ExecuteNonQuery(query));
                }
                catch (Exception ex)
                {
                    return Response<int>.Error(ex);
                }

            }, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        public Task<Response<int>> ExecuteNonQuery(string query, Dictionary<string, object> parameters)
        {
            return Task.Factory.StartNew(delegate
            {
                try
                {
                    return Response<int>.Result(this.Connection.ExecuteNonQuery(query, parameters));
                }
                catch (Exception ex)
                {
                    return Response<int>.Error(ex);
                }
            }, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        public Task<Response<int>> ExecuteNonQuery(string query, object[] parameters) 
        {
            return Task.Factory.StartNew(delegate
            {
                try
                {
                    return Response<int>.Result(this.Connection.ExecuteNonQuery(query, parameters));
                }
                catch (Exception ex)
                {
                    return Response<int>.Error(ex);
                }
            }, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        //===================================//
        //===================================//



        //===================================//
        //===================================//

        public Task<Response<IReadOnlyDictionary<string, object>[]>> ExecuteData(string query)
        {
            return Task.Factory.StartNew(delegate
            {
                try
                {
                    return Response<IReadOnlyDictionary<string, object>[]>.Result(this.Connection.ExecuteData(query));
                }
                catch (Exception ex)
                {
                    return Response<IReadOnlyDictionary<string, object>[]>.Error(ex);
                }

            }, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        //===================================//
        //===================================//

        #endregion

    }
}