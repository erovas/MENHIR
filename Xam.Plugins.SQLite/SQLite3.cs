using SQLitePCL;
using System;

/*
 https://github.com/praeclarum/sqlite-net
*/
namespace Xam.Plugins.SQLite
{
    public static class SQLite3
    {
        public enum Result
        {
            OK = 0,
            Error = 1,
            Internal = 2,
            Perm = 3,
            Abort = 4,
            Busy = 5,
            Locked = 6,
            NoMem = 7,
            ReadOnly = 8,
            Interrupt = 9,
            IOError = 10,
            Corrupt = 11,
            NotFound = 12,
            Full = 13,
            CannotOpen = 14,
            LockErr = 0xF,
            Empty = 0x10,
            SchemaChngd = 17,
            TooBig = 18,
            Constraint = 19,
            Mismatch = 20,
            Misuse = 21,
            NotImplementedLFS = 22,
            AccessDenied = 23,
            Format = 24,
            Range = 25,
            NonDBFile = 26,
            Notice = 27,
            Warning = 28,
            Row = 100,
            Done = 101
        }

        public enum ExtendedResult
        {
            IOErrorRead = 266,
            IOErrorShortRead = 522,
            IOErrorWrite = 778,
            IOErrorFsync = 1034,
            IOErrorDirFSync = 1290,
            IOErrorTruncate = 1546,
            IOErrorFStat = 1802,
            IOErrorUnlock = 2058,
            IOErrorRdlock = 2314,
            IOErrorDelete = 2570,
            IOErrorBlocked = 2826,
            IOErrorNoMem = 3082,
            IOErrorAccess = 3338,
            IOErrorCheckReservedLock = 3594,
            IOErrorLock = 3850,
            IOErrorClose = 4106,
            IOErrorDirClose = 4362,
            IOErrorSHMOpen = 4618,
            IOErrorSHMSize = 4874,
            IOErrorSHMLock = 5130,
            IOErrorSHMMap = 5386,
            IOErrorSeek = 5642,
            IOErrorDeleteNoEnt = 5898,
            IOErrorMMap = 6154,
            LockedSharedcache = 262,
            BusyRecovery = 261,
            CannottOpenNoTempDir = 270,
            CannotOpenIsDir = 526,
            CannotOpenFullPath = 782,
            CorruptVTab = 267,
            ReadonlyRecovery = 264,
            ReadonlyCannotLock = 520,
            ReadonlyRollback = 776,
            AbortRollback = 516,
            ConstraintCheck = 275,
            ConstraintCommitHook = 531,
            ConstraintForeignKey = 787,
            ConstraintFunction = 1043,
            ConstraintNotNull = 1299,
            ConstraintPrimaryKey = 1555,
            ConstraintTrigger = 1811,
            ConstraintUnique = 2067,
            ConstraintVTab = 2323,
            NoticeRecoverWAL = 283,
            NoticeRecoverRollback = 539
        }

        public enum ConfigOption
        {
            SingleThread = 1,
            MultiThread,
            Serialized
        }

        public enum ColType
        {
            Integer = 1,
            Float,
            Text,
            Blob,
            Null
        }

        private const string LibraryPath = "sqlite3";

        public static Result Open(string filename, out sqlite3 db)
        {
            return (Result)raw.sqlite3_open(filename, out db);
        }

        public static Result Open(string filename, out sqlite3 db, int flags, string vfsName)
        {
            return (Result)raw.sqlite3_open_v2(filename, out db, flags, vfsName);
        }

        public static Result Close(sqlite3 db)
        {
            return (Result)raw.sqlite3_close(db);
        }

        public static Result Close2(sqlite3 db)
        {
            return (Result)raw.sqlite3_close_v2(db);
        }

        public static Result BusyTimeout(sqlite3 db, int milliseconds)
        {
            return (Result)raw.sqlite3_busy_timeout(db, milliseconds);
        }

        public static int Changes(sqlite3 db)
        {
            return raw.sqlite3_changes(db);
        }

        public static sqlite3_stmt Prepare2(sqlite3 db, string query)
        {
            sqlite3_stmt stmt = null;
            int num = raw.sqlite3_prepare_v2(db, query, out stmt);
            if (num != 0)
                throw new SQLiteException((Result)num, GetErrmsg(db));
            

            return stmt;
        }

        public static Result Step(sqlite3_stmt stmt)
        {
            return (Result)raw.sqlite3_step(stmt);
        }

        public static Result Reset(sqlite3_stmt stmt)
        {
            return (Result)raw.sqlite3_reset(stmt);
        }

        public static Result Finalize(sqlite3_stmt stmt)
        {
            return (Result)raw.sqlite3_finalize(stmt);
        }

        public static long LastInsertRowid(sqlite3 db)
        {
            return raw.sqlite3_last_insert_rowid(db);
        }

        public static string GetErrmsg(sqlite3 db)
        {
            return raw.sqlite3_errmsg(db).utf8_to_string();
        }

        public static int BindParameterIndex(sqlite3_stmt stmt, string name)
        {
            return raw.sqlite3_bind_parameter_index(stmt, name);
        }

        public static int BindNull(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_bind_null(stmt, index);
        }

        public static int BindInt(sqlite3_stmt stmt, int index, int val)
        {
            return raw.sqlite3_bind_int(stmt, index, val);
        }

        public static int BindInt64(sqlite3_stmt stmt, int index, long val)
        {
            return raw.sqlite3_bind_int64(stmt, index, val);
        }

        public static int BindDouble(sqlite3_stmt stmt, int index, double val)
        {
            return raw.sqlite3_bind_double(stmt, index, val);
        }

        public static int BindText(sqlite3_stmt stmt, int index, string val, int n, IntPtr free)
        {
            return raw.sqlite3_bind_text(stmt, index, val);
        }

        public static int BindBlob(sqlite3_stmt stmt, int index, byte[] val, int n, IntPtr free)
        {
            return raw.sqlite3_bind_blob(stmt, index, val);
        }

        public static int ColumnCount(sqlite3_stmt stmt)
        {
            return raw.sqlite3_column_count(stmt);
        }

        public static string ColumnName(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_name(stmt, index).utf8_to_string();
        }

        public static string ColumnName16(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_name(stmt, index).utf8_to_string();
        }

        public static ColType ColumnType(sqlite3_stmt stmt, int index)
        {
            return (ColType)raw.sqlite3_column_type(stmt, index);
        }

        public static int ColumnInt(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_int(stmt, index);
        }

        public static long ColumnInt64(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_int64(stmt, index);
        }

        public static double ColumnDouble(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_double(stmt, index);
        }

        public static string ColumnText(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_text(stmt, index).utf8_to_string();
        }

        public static string ColumnText16(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_text(stmt, index).utf8_to_string();
        }

        public static byte[] ColumnBlob(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_blob(stmt, index).ToArray();
        }

        public static int ColumnBytes(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_bytes(stmt, index);
        }

        public static string ColumnString(sqlite3_stmt stmt, int index)
        {
            return raw.sqlite3_column_text(stmt, index).utf8_to_string();
        }

        public static byte[] ColumnByteArray(sqlite3_stmt stmt, int index)
        {
            if (ColumnBytes(stmt, index) > 0)
            {
                return ColumnBlob(stmt, index);
            }

            return new byte[0];
        }

        public static Result EnableLoadExtension(sqlite3 db, int onoff)
        {
            return (Result)raw.sqlite3_enable_load_extension(db, onoff);
        }

        public static int LibVersionNumber()
        {
            return raw.sqlite3_libversion_number();
        }

        public static Result GetResult(sqlite3 db)
        {
            return (Result)raw.sqlite3_errcode(db);
        }

        public static ExtendedResult ExtendedErrCode(sqlite3 db)
        {
            return (ExtendedResult)raw.sqlite3_extended_errcode(db);
        }

        public static sqlite3_backup BackupInit(sqlite3 destDb, string destName, sqlite3 sourceDb, string sourceName)
        {
            return raw.sqlite3_backup_init(destDb, destName, sourceDb, sourceName);
        }

        public static Result BackupStep(sqlite3_backup backup, int numPages)
        {
            return (Result)raw.sqlite3_backup_step(backup, numPages);
        }

        public static Result BackupFinish(sqlite3_backup backup)
        {
            return (Result)raw.sqlite3_backup_finish(backup);
        }
    }
}
