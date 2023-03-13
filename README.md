## Usase

##### Install mongodb database tools
[link](https://www.mongodb.com/docs/database-tools/mongodump/) - Mongodb

```js
const backup = require('backup-mongodb');
```

```js
backup.backup({
    uri: "mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/?authSource=<AUTH DB>",
    gzip: true,
    out: path.join(process.cwd(), "backup")
});
```

```js
backup.backup({
    host: "localhost",
    port: 27017,
    authenticationDatabase: null,
    authenticationMechanism: null,
    username: "admin",
    password: "1234",
    db: "my-database", // database name
    gzip: true,
    out: path.join(process.cwd(), "backup")
});
```

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