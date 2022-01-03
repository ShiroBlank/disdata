![](https://cdn.androne.dev/content/2021/06/disdata.png)

## Use Discord like a database

# Docs

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [Disdata](#disdata)
    *   [Parameters](#parameters)
    *   [Examples](#examples)
    *   [login](#login)
        *   [Parameters](#parameters-1)
    *   [newDB](#newdb)
        *   [Parameters](#parameters-2)
    *   [useDB](#usedb)
        *   [Parameters](#parameters-3)
    *   [set](#set)
        *   [Parameters](#parameters-4)
    *   [edit](#edit)
        *   [Parameters](#parameters-5)
    *   [get](#get)
        *   [Parameters](#parameters-6)
    *   [has](#has)
        *   [Parameters](#parameters-7)
    *   [delete](#delete)
        *   [Parameters](#parameters-8)
    *   [inviteDB](#invitedb)

## Disdata

Disdata

### Parameters

*   `token`  
*   `dbname`   (optional, default `null`)

### Caching
This is a modified version of Disdata that includes caching to reduce the reliance on the discord API.

### Examples

```javascript
const Disdata = require('disdata');
async function main(){
 const db = new Disdata("NzE3NzI2Njgz.x.x.x.ClUADtk")
   await db.login()
   await db.useDB("test")
   // console.log(await db.inviteDB())
   await db.set("hello","World")
   console.log("Hello =>"+await db.get("hello"))
}
```

### login

#### Parameters

*   `BotToken` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Bot token (optional, default `this.token`)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### newDB

#### Parameters

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** name of db (optional, default `this.dbname`)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### useDB

#### Parameters

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Name of the DB (optional, default `this.dbname`)
*   `createIfNotExist` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** create database if note exist (optional, default `true`)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### set

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** (use JSON.stringify for object)
*   `editIfAlredyExist` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** edit key if already used (optional, default `true`)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### edit

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new data (use JSON.stringify for object)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### get

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** Data of this key

### has

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** Boolean if key exist

### delete

#### Parameters

*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### inviteDB

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** URL invitation Discord
