let j_n = (t) => {
    return typeof t !== "number" ? `'${t}'` : t;  // 用单引号包裹非数字类型
};

// 生成 UPDATE 语句
let update_sql = (table, prop, condition) => {
    if (prop === undefined) { return "prop is not undefined"; }
    let pl = Object.entries(prop);
    let cl = Object.entries(condition || {}); // 默认空对象
    let sql = `UPDATE "${table}" SET "${pl[0][0]}"=${j_n(pl[0][1])}`;
    for (let i = 1; i < pl.length; i++) {
        sql += `, "${pl[i][0]}"=${j_n(pl[i][1])}`;
    }

    if (cl.length === 0) { return sql + ";"; } // 如果没有条件，直接返回
    sql += ` WHERE "${cl[0][0]}"=${j_n(cl[0][1])}`;
    for (let i = 1; i < cl.length; i++) {
        sql += ` AND "${cl[i][0]}"=${j_n(cl[i][1])}`;
    }
    return sql + ";";
};

// 生成 INSERT 语句
let insert_sql = (table, prop) => {
    if (Array.isArray(prop)) {
        if (prop.length === 0) { return "prop is not null"; }
        let sql = `INSERT INTO "${table}" VALUES (${j_n(prop[0])}`;
        for (let i = 1; i < prop.length; i++) {
            sql += `, ${j_n(prop[i])}`;
        }
        return sql + ");";
    }
    if (prop === undefined) { return "prop is not undefined"; }
    let pl = Object.entries(prop);
    if (pl.length < 1) { return "prop is not null"; }
    let sql = `INSERT INTO "${table}" ("${pl[0][0]}"`;
    for (let i = 1; i < pl.length; i++) {
        sql += `, "${pl[i][0]}"`;
    }
    sql += `) VALUES(${j_n(pl[0][1])}`;
    for (let i = 1; i < pl.length; i++) {
        sql += `, ${j_n(pl[i][1])}`;
    }
    sql += ");";
    return sql;
};

// 生成 SELECT 语句
let select_sql = (table, pl, condition) => {
    if (pl === undefined) { return "pl is not undefined"; }
    let cl = Object.entries(condition || {}); // 默认空对象
    let sql;
    if (Array.isArray(pl)) {
        if (pl[0] === "*") {
            sql = "SELECT *";
        } else {
            sql = `SELECT "${pl[0]}"`;
            for (let i = 1; i < pl.length; i++) {
                sql += `, "${pl[i]}"`;
            }
        }
    } else {
        sql = `SELECT "${pl}"`;
        if (pl === "*") { sql = "SELECT *"; }
    }
    sql += ` FROM "${table}"`;
    if (cl.length === 0) { return sql + ";"; } // 如果没有条件，直接返回
    sql += ` WHERE "${cl[0][0]}"=${j_n(cl[0][1])}`;
    for (let i = 1; i < cl.length; i++) {
        sql += ` AND "${cl[i][0]}"=${j_n(cl[i][1])}`;
    }
    return sql + ";";
};

// 生成重命名表的 SQL 语句
let rename_table_sql = (table, value) => {
    return `ALTER TABLE "${table}" RENAME TO "${value}"`;  // 加上引号以防特殊字符
};

// 生成添加列的 SQL 语句
let add_column_sql = (table, prop) => {
    let pl = Object.entries(prop);
    if (pl.length === 0 || prop === undefined) { return "prop is required"; }
    let sql = `ALTER TABLE "${table}" ADD COLUMN "${pl[0][0]}" ${pl[0][1]}`;
    for (let i = 1; i < pl.length; i++) {
        sql += `, ADD COLUMN "${pl[i][0]}" ${pl[i][1]}`;
    }
    return sql + ";";
};

module.exports = { rename_table_sql, insert_sql, add_column_sql, update_sql, select_sql };
