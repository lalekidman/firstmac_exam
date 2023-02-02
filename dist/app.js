"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const data = fs_1.default.readFileSync("./data/data.json", { encoding: "utf-8" });
const input = fs_1.default.readFileSync("./data/input.json", { encoding: "utf-8" });
let userData = [];
let userSearchInput = [];
try {
    userData = JSON.parse(data);
    userSearchInput = JSON.parse(input);
}
catch (error) {
    console.log('error :>> ', error);
    // ignore or skip
}
for (const { from, to } of userSearchInput) {
    const link = [from];
    if (from >= userData.length) {
        for (let x = from; x <= to; x++) {
            if (userData[x].follows.includes(to)) {
                link.push(to);
                console.log(`Case ${from} to ${to}: ${link.join("->")}`);
            }
            else {
                link.push(x);
            }
        }
    }
}
console.log('data :>>  ', userData);
console.log('input :>> ', input);
// first is I'll use `from` to use it as the index to get the follows of that user in the `data.json` file.
// then, check the follower's if selected user from the "from" value is already follow the user from "to" value.
// if not, then check the selected user's follows from "from" value if they are linked to the user from the "to" value
// on the graph example,
// the values should be.
[{
        follows: [1, 4, 5]
    },
    {
        follows: [2, 4]
    },
    {
        follows: [3]
    },
    {
        follows: []
    },
    {
        follows: [0, 1]
    },
    {
        follows: [0]
    }
];
// if you input 0 - 3,
// 
