import fs from 'fs'
const data = fs.readFileSync("./data/data.json", {encoding: "utf-8"})
const input = fs.readFileSync("./data/input.json", {encoding: "utf-8"})

interface IUserData {
  follows: number[]
}
interface IUserSearchInput {
  from: number // userId index
  to: number
}

let userData:IUserData[] = []
let userSearchInput:IUserSearchInput[] = []
try {
  userData = JSON.parse(data)
  userSearchInput = JSON.parse(input)
} catch (error) {
  console.log('error :>> ', error);
  // ignore or skip
}

// console.log('data :>>  ', userData);
// console.log('input :>> ', input);

const closestLink = (link: number[], from: number, to: number):number[] => {
  if (from <= userData.length) {
    // remove all of the user who already in the link
    if (!link.includes(to)) {
      if (!link.includes(from)) {
        link.push(from)
        const follows = userData[from].follows.sort().filter((userId) => !(link.includes(userId)))
        if (follows.includes(to)) {
          link.push(to)
        } else {
          let shortes:number[] = []
          for (const follow of follows) {
            const nestedLink = closestLink([...link], follow, to)
            if (nestedLink.includes(to)) {
              if (shortes.length === 0 || nestedLink.length < shortes.length) {
                shortes = nestedLink
              }
            }
          }
          link = shortes
        }
      }
    }
  }
  return link
}

console.log("Scenario               Shortest Link")
for (const {from, to} of userSearchInput) {
  let shortest:number[] = closestLink([], from, to)
  if (shortest.includes(to)) {
    console.log(`Case ${from} to ${to}:           ${shortest.join("->")}`)
  } else {
    console.log(`Case ${from} to ${to}:           No Link(-1)`)
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
