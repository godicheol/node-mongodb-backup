const { spawn } = require('child_process');
const schedule = require('node-schedule');
const os = require('os');

const DEFAULT_OPTIONS = {
    uri: null, // mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/?authSource=<AUTH DB>
    host: "localhost", // localhost
    port: 27017, // 27017
    authenticationDatabase: null, // admin?
    authenticationMechanism: null,
    username: null,
    password: null,
    db: null, // database name
    gzip: true,
    out: process.cwd()
}

// Universal module definition
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser window.moduleName
        root.backup = factory();
    }
})(this, function() {
    'use strict';

    const backup = function(options) {
        return new Promise(function(resolve, reject) {
            let optionArray = [];
            for (const key in options) {
                const value = options[key];
                switch(key) {
                    case "uri":
                    case "host":
                    case "port":
                    case "authenticationDatabase":
                    case "authenticationMechanism":
                    case "username":
                    case "password":
                    case "db":
                    case "out":
                        optionArray.push("\-\-"+key+"\="+value);
                        break;
                    case "gzip":
                        if (value) {
                            optionArray.push("\-\-"+key);
                        }
                        break;
                }
            }

            // install mongodb database tools
            // https://www.mongodb.com/docs/database-tools/mongodump/
            const pcss = spawn('mongodump', optionArray, {
                shell: os.platform() === "win32" ? true : undefined
            });

            pcss.on("exit", function(code, signal) {
                if(code) {
                    reject(code);
                    console.log('Backup process exited with code ', code);
                } else if (signal) {
                    reject(signal);
                    console.error('Backup process was killed with singal ', signal);
                } else { 
                    console.log('Successfully backedup the database');
                    resolve();
                }
            });
        });
    }

    // Cron-style Scheduling
    // 
    // *    *    *    *    *    *
    // ┬    ┬    ┬    ┬    ┬    ┬
    // │    │    │    │    │    │
    // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    // │    │    │    │    └───── month (1 - 12)
    // │    │    │    └────────── day of month (1 - 31)
    // │    │    └─────────────── hour (0 - 23)
    // │    └──────────────────── minute (0 - 59)
    // └───────────────────────── second (0 - 59, OPTIONAL)
    const setSchedule = function(cron, options, cb) {
        const job = schedule.scheduleJob(cron, async function() {
            try {
                await backup(options);
                cb(null, true);
            } catch(err) {
                cb(err);
            }
        });

        return job;
    }

    return {
        exec: backup,
        schedule: schedule.scheduleJob,
    }
});