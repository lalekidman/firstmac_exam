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
console.log('data :>>  ', userData);
console.log('input :>> ', input);
const closestLink = (steps, from, to) => {
    if (from <= userData.length) {
        const follows = userData[from].follows.sort().filter((userId) => !(steps.includes(userId)));
        if (!steps.includes(from)) {
            steps.push(from);
            if (follows.includes(to)) {
                steps.push(to);
            }
            else {
                for (const follow of follows) {
                    steps = closestLink(steps, follow, to);
                    if (steps.includes(to)) {
                        break;
                    }
                }
            }
        }
    }
    return steps;
};
console.log("Scenario               Shortest Link");
for (const { from, to } of userSearchInput) {
    let shortest = [];
    let allSteps = [];
    if (from <= userData.length) {
        const follows = userData[from].follows.sort();
        if (follows.includes(to)) {
            shortest = [from, to];
        }
        else {
            let first = true;
            for (const follow of follows) {
                if (!allSteps.includes(follow)) {
                    const finalSteps = closestLink([from], follow, to);
                    allSteps = [
                        // use `Set` to avoid duplicate step.
                        ...new Set([
                            ...finalSteps,
                            ...allSteps
                        ])
                    ];
                    if (!first) {
                        if (finalSteps.length < shortest.length) {
                            // overwrite the value with the shortest steps.
                            shortest = finalSteps;
                        }
                    }
                    else {
                        first = false;
                        shortest = finalSteps;
                    }
                }
            }
        }
    }
    if (shortest.includes(to)) {
        console.log(`Case ${from} to ${to}:           ${shortest.join("->")}`);
    }
    else {
        console.log(`Case ${from} to ${to}:           No Link(-1)`);
    }
}
// on the graph example,
// the values should be.
// [{
//     follows: [1, 4, 5]
//   },
//   {
//     follows: [2, 4]
//   },
//   {
//     follows: [3]
//   },
//   {
//     follows: []
//   },
//   {
//     follows: [2, 3]
//   },
//   {
//     follows: [0, 3]
//   }
// ]
// if you input 0 - 3,
//  first thing to do is to check if user 0 is follows 3, if not, then check the elements of the follows,
//  the first element of the `follows` is user 1, 
//            - check user 1 if it follows user 3, if not, get the first element.
//                -  first element of `follows` for user 1 is user 2.
//                    - check the follows of user 2 if it follows user 3
//                    - if yes, then stop, the steps are "user 0 -> user 1 -> user 2 -> user 3" 
//                    - if not then again, repeat again the steps, since user 3 doesn't follow anyone, then the value should be -1
//            - if not in the element two, which is user 4.
// I think it should check all of the possibilities first before comparing, because I need to know who is the closest in link not just to find it.
