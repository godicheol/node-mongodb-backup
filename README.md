## Usase

#### [link](https://www.mongodb.com/docs/database-tools/mongodump/) - Install mongoDB database tools

```js
const backup = require('mongodb-backup');
```

```js
await backup.exec({
    uri: "mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/?authSource=<AUTH DB>",
    gzip: true,
    out: path.join(process.cwd(), "backup")
});
```

```js
await backup.exec({
    host: "localhost",
    port: 27017,
    authenticationDatabase: "admin", // authSource
    authenticationMechanism: null,
    username: "admin",
    password: "1234",
    db: "my-database", // database name
    gzip: true,
    out: path.join(process.cwd(), "backup")
});
```

#### [link](https://www.npmjs.com/package/node-schedule) - Cron format guide

```js
let job;

job = backup.schedule("0 4 0 * * *" , {
    uri: "mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/?authSource=<AUTH DB>",
    gzip: true,
    out: path.join(process.cwd(), "backup")
}, function(err) {
    if (err && job) {
        job.cancel();
        job = null;
    }
});
```