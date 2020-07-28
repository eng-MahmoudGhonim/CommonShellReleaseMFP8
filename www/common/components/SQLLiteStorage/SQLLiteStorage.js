(function() {
  "use strict";
  var SQLLiteStorage = function(options) {
    //variables defined here.
    //all unique varabiles should be here.
	this.db = null;
	this.dbName = options.dbName;
    this.init(options);
  };
  SQLLiteStorage.prototype = (function() {
    //private functions defined here

    var init = function(options) {
        // this.db = null;
        // this.dbName = options.dbName; //"DBStorage";
        // document.addEventListener("deviceready", function() {
        this.db = window.sqlitePlugin.openDatabase({
          name: this.dbName,
          location: "default",
          androidDatabaseProvider: "system"
        });
        // });
      },
      toString = function(param) {
        try {
          var isBoolean = function(arg) {
            return typeof arg === "boolean";
          };
          var isNumber = function(arg) {
            return typeof arg === "number";
          };
          var isString = function(arg) {
            return typeof arg === "string";
          };
          var isFunction = function(arg) {
            return typeof arg === "function";
          };
          var isObject = function(arg) {
            return typeof arg === "object";
          };
          var isUndefined = function(arg) {
            return typeof arg === "undefined";
          };

          if (isUndefined(param)) {
            return "undefined";
          } else if (isObject(param)) {
            return JSON.stringify(param);
          } else if (isString(param)) {
            return param;
          } else {
            //in case of numbers and boolean functions
            return param.toString();
          }
        } catch (e) {
          return param;
        }
      },
      getData = function(key, callback) {
        try {
          this.db.transaction(function(tx) {
            tx.executeSql(
              'SELECT * FROM '+this.dbName+' WHERE KEY = "' + key + '"',
              [],
              function(tx, rs) {
              //  debugger;
                console.log(rs.rows.item(0));
                if (rs && rs.rows && rs.rows.item(0) && rs.rows.item(0).value)
                  callback(rs.rows.item(0).value);
                else callback(null);
              },
              function(tx, error) {
                console.log("SELECT error: " + error.message);
              }
            );
          });
        } catch (e) {
          console.log(e);
        }
      },
      setData = function(key, value) {
        try {
          this.db.transaction(
            function(tx) {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS '+this.dbName+' (key, value)'
              );
              value = toString(value);
              tx.executeSql('INSERT INTO '+this.dbName+' VALUES (?1,?2)', [
                key,
                value
              ]);
            },
            function(error) {
              console.log("Transaction ERROR: " + error.message);
            },
            function() {
              console.log("Populated database OK");
            }
          );
        } catch (e) {
          console.log(e);
        }
      };

    return {
      //public members defined here as
      //with revealing module pattern
      init: init,
      setData: setData,
      getData: getData
    };
  })();
  window.SQLLiteStorage = SQLLiteStorage;
})();
