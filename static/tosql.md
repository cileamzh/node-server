### update_sql 生成UPDATE 语句
```js
update_sql(表名,新数据,条件);

update_sql("user", { uname: "cileam" }, { uid: 1000001 });
// 打印结果 UPDATE "user" SET "uname"='cileam' WHERE "uid"=1000001;
```

### insert_sql 生成INSERT语句
```js
insert_sql(表名,新数据);

insert_sql("user",{uame:"new username",password:"new password"});
// 打印结果 INSERT INTO "user" ("uanme","password") VALUES('new username','new password');

insert_sql("user",["youruname"]);
// 打印结果 INSERT INTO "user" VALUES('youruname');
```


### select_sql 生成SELECT语句
```js
select_sql(表名,查询列名,条件);

select_sql("user","*",{uid:1000001});
// 打印结果 SELECT * FROM "user" WHERE "uid"=1000001;

select_sql("user",["uid","uname"],{uid:1000001});
// 打印结果 SELECT "uid", "uname" FROM "user" WHERE "uid"=1000001;
```
