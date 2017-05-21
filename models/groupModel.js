/**
 * Created by YS on 2017-04-14.
 */

var groupModel = {
    setGroup : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var insert = [data.package_name, data.group_name, 
                JSON.stringify(data.group_set), JSON.stringify(data.group_set)];
            var sql = "INSERT INTO group_table SET " +
                "group_package_name = ?, " +
                "group_name = ?, " +
                "group_set = ? " +
                "ON DUPLICATE KEY UPDATE " +
                "group_set = ? ";

            context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error("insert failed");
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }

                return resolved(context);
            });
        });
    },

    deleteGroup : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var del = [data.package_name, data.group_name];
            var sql = `DELETE FROM group_table 
                WHERE group_package_name = ? 
                AND group_name = ? `;

            context.connection.query(sql, del, function (err, rows) {
                if (err) {
                    var error = new Error("delete failed");
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }

                return resolved(context);
            });
        });
    },

    getGroupList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT group_name " +
                "FROM group_table " +
                "WHERE `group_package_name` = ? " +
                "ORDER BY group_name ASC ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 9404;
                    return rejected({ context : context, error : error });
                }
                
                data.group_list = [];
                rows.forEach(function(row) {
                    data.group_list.push(row.group_name);
                });

                return resolved(context);
            });
        });
    },

    getGroup : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name, data.group_name];
            var sql = "SELECT group_set " +
                "FROM group_table " +
                "WHERE `group_package_name` = ? " +
                "AND `group_name` = ? " +
                "LIMIT 1 ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 9404;
                    return rejected({ context : context, error : error });
                }
                
                data.group_set = JSON.parse(rows[0].group_set);

                return resolved(context);
            });
        });
    },

};

module.exports = groupModel;