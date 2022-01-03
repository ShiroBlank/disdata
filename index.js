const NodeCache = require("node-cache");
const myCache = new NodeCache( { stdTTL: 600, checkperiod: 700 } );
const Discord = require("discord.js-light");
const CHANNELS = ["index", "data", "files", "settings", "chat"];
function atob(str) {
  const buff = Buffer.from(str);
  return buff.toString("base64");
}
function btoa(str) {
  const buff = Buffer.from(str, "base64");
  return buff.toString("utf8");
}
/**
 * Disdata
 * @example
 * const Disdata = require('disdata');
 * async function main(){
 *  const db = new Disdata("NzE3NzI2Njgz.x.x.x.ClUADtk")
 *    await db.login()
 *    await db.useDB("test")
 *    // console.log(await db.inviteDB())
 *    await db.set("hello","World")
 *    console.log("Hello =>"+await db.get("hello"))
 * }
 *
 */
class Disdata {
  /*
   * @param {string} {token} - Bot Token
   * @param {string=} {dbname} - DB name
   */
  constructor(token, dbname = null) {
    (this.token = token), (this.dbname = dbname);
    Disdata.channels = {};
  }
  /**
   * @summary Login with the Discord bot Token
   * @param {string=} BotToken - Bot token
   * @return {Promise}
   */
  login(BotToken = this.token) {
    return new Promise((resolve, reject) => {
      Disdata.DisClient = new Discord.Client({
        cacheGuilds: true,
        cacheChannels: true,
        cacheOverwrites: false,
        cacheRoles: false,
        cacheEmojis: false,
        cachePresences: false,
      });

      Disdata.DisClient.login(BotToken).then(resolve(true)).catch(reject);
    });
  }
  /**
   * @summary Create a new DB
   * @param {string} [name] - name of db
   * @return {Promise}
   */
  newDB(name = this.dbname) {
    return new Promise((resolve, reject) => {
      Disdata.DisClient.guilds
        .create(name, {
          channels: [
            { name: "index" },
            { name: "data" },
            { name: "files" },
            { name: "settings" },
            { name: "chat" },
          ],
        })
        .then(resolve)
        .catch(reject);
    });
  }
  /**
   * @summary Use a DB
   * @param {string} [name] - Name of the DB
   * @param {boolean} [createIfNotExist=true] - create database if note exist
   * @return {Promise}
   */
  useDB(name = this.dbname, createIfNotExist = true) {
    var found = false;
    return new Promise(async (resolve, reject) => {
      await Disdata.DisClient.guilds.fetch().then(async (guilds) => {
        await Promise.all(
          guilds.map(async (guild) => {
            if (guild.name == name && !found) {
              found = true;
              Disdata.currentDB = guild.name;
              Disdata.currentDBGuild = guild;
              const channels = await guild.channels.fetch();
              // console.log(channels)
              await Promise.all(
                channels.map(async (c) => {
                  if (CHANNELS.includes(c.name)) {
                    Disdata.channels[c.name] = c;
                    //console.log(c.name)
                  }
                  //   console.log(c.name)
                })
              );

              return resolve();
            }
          })
        );
      });
      if (createIfNotExist && !found) {
        // create and use this DB if not exist
        console.log("new db");
        this.newDB(name)
          .then(() => {
            this.useDB(name).then(resolve).catch(reject);
          })
          .catch(reject);
      }
    });
  }
  /**
   * @summary Put the data to a key
   * @param {string} key
   * @param {string} data - (use JSON.stringify for object)
   * @param {boolean} editIfAlredyExist - edit key if already used
   * @return {Promise}
   */
  set(key, data, editIfAlredyExist = true) {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        console.log("Data invalid");
        reject(false);
      }
      if (typeof key != "string" || !key || !key.search(/[^a-zA-Z]+/g)) {
        console.log("Key invalid");
        reject(false);
      }
      let exists = await this.has(key);
      if (exists) {
        if (editIfAlredyExist) {
          return this.edit(key, data).then(resolve).catch(reject);
        }

        return reject("Use edit for alredy stored data, or delete it");
      }
      myCache.set(key, data);
      // console.log(Disdata.channels["data"])

      const content = atob(data) + ":" + Date.now().toString();
      //console.log(content);
      Disdata.channels["data"]
        .send(content)
        .then((msg) => {
          const index =
            key + ":" + msg.id.toString() + ":" + Date.now().toString();
          Disdata.channels["index"]
            .send(index)
            .then(() => {
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
  /**
   * @summary Modify the data of a key
   * @param {string} key
   * @param {string} data - new data (use JSON.stringify for object)
   * @return {Promise}
   */
  edit(key, data) {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        console.log("Data invalid");
        reject(false);
      }
      if (typeof key != "string" || !key || !key.search(/[^a-zA-Z]+/g)) {
        console.log("Key invalid");
        reject(false);
      }
      let exists = await this.has(key);

      if (!exists) {
        console.log("data not exist");
        reject(false);
      }
      // console.log(Disdata.channels["data"])

      const content = atob(data) + ":" + Date.now().toString();
      Disdata.channels["index"].messages
        .fetch({ limit: 100 })
        .then((messages) => {
          //Iterate through the messages here with the variable "messages".
          messages.forEach((message) => {
            if (message.content.split(":")[0] === key) {
              Disdata.channels["data"].messages
                .fetch(message.content.split(":")[1])
                .then((msg) => {
                  msg.edit(content);
                  resolve();
                })
                .catch(reject);
            }
          });
        })
        .catch(reject);
    });
  }
  /**
   * @summary Get data of a key
   * @param {string} key
   * @return {Promise<String>} - Data of this key
   */
  get(key) {
    return new Promise((resolve, reject) => {
      if (typeof key != "string" || !key || !key.search(/[^a-zA-Z]+/g)) {
        console.log("Key invalid");
        reject(false);
      }
      myCache.get(key, async (err, value) => {
        if (err) {
          console.log(err);
          reject(false);
        } else (value) => {
          resolve(value);
        }
      });
      // console.log(Disdata.channels["data"])
      Disdata.channels["index"].messages
        .fetch({ limit: 100 })
        .then((messages) => {
          //Iterate through the messages here with the variable "messages".
          messages.forEach((message) => {
            if (message.content.split(":")[0] === key) {
              Disdata.channels["data"].messages
                .fetch(message.content.split(":")[1])
                .then((msg) => {
                  resolve(btoa(msg.content));
                });
            }
          });
        });
    });
  }
  /**
   * @summary Check if a key exist
   * @param {string} key
   * @return {Promise<Boolean>} - Boolean if key exist
   */
  has(key) {
    return new Promise((resolve, reject) => {
      if (typeof key != "string" || !key || !key.search(/[^a-zA-Z]+/g)) {
        console.log("Key invalid");
        reject(false);
      }
      if (myCache.has(key)) {
        resolve(true);
      }
      // console.log(Disdata.channels["data"])
      Disdata.channels["index"].messages
        .fetch({ limit: 100 })
        .then((messages) => {
          // console.log(`Received ${messages.size} messages`);
          //Iterate through the messages here with the variable "messages".
          var found = false;
          messages.map((message) => {
            if (message.content.split(":")[0] === key) {
              //  console.log(message.content.split(":")[0]);
              found = true;
            }
          });
          //console.log(found);
          resolve(found);
        });
    });
  }
  /**
   * @summary Delete a key
   * @param {string} key
   * @return {Promise}
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      if (typeof key != "string" || !key || !key.search(/[^a-zA-Z]+/g)) {
        console.log("Key invalid");
        reject();
      }
      myCache.del(key);
      // console.log(Disdata.channels["data"])
      Disdata.channels["index"].messages
        .fetch({ limit: 100 })
        .then((messages) => {
          //Iterate through the messages here with the variable "messages".
          messages.map((message) => {
            if (message.content.split(":")[0] === key) {
              message.delete();
              setImmediate(() => {
                Disdata.channels["data"].messages
                  .fetch(message.content.split(":")[1])
                  .then((msg) => {
                    msg.delete();
                  });
                resolve();
              });
            }
          });
        });
    });
  }
  /**
   * @summary Get a invite link of a guild Discord (guild currently used for this DB)
   * @return {Promise<String>} - URL invitation Discord
   */
  inviteDB() {
    return new Promise((resolve, reject) => {
      Disdata.channels["chat"]
        .createInvite({ maxAge: 0, unique: true, reason: "" })
        .then((Invite) => {
          resolve(Invite.url);
        })
        .catch(reject);
    });
  }
}
module.exports = Disdata;
