
import fs from "fs"

import pkg from 'lodash';
const { capitalize } = pkg;

const misclocalsFileContent = `/** @format */
import dotenv from "dotenv";
dotenv.config({
  path: "../.env"
})
export default class Locals {
<placeholder>
}`

const typeslocalsFileContent = `export type Locals = Record<<placeholder>, string>`

const dotenvContent = fs.readFileSync(".env").toString()

const misclocalsContent = []
for (const line of dotenvContent.split("\n")){
    if(line !=="" && line !== "\n"){
        const varenvName = line.split("=")[0]
        misclocalsContent.push(
            `\tstatic ${varenvName.split("_").map(word => capitalize(word)).join("")} = process.env.${varenvName}!\n`
        )
    }

}

const typeslocalsContent = []
for(const line of dotenvContent.split("\n")) {
   if(line!=="" && line !== "\n"){
    const varenv = line.split("=")[0].split("_").map(word => capitalize(word)).join("")
    typeslocalsContent.push("\""+varenv+"\"")
   } 
}

// Write the misc/locals.ts
fs.writeFileSync(
    "src/misc/locals.ts", 
    misclocalsFileContent.replace("<placeholder>", misclocalsContent.join(""))
)

// Write the types/locals.ts
fs.writeFileSync(
    "src/interfaces/locals.ts",
    typeslocalsFileContent.replace("<placeholder>", typeslocalsContent.join(" | "))
)