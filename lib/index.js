import { sum } from "./sum"

const target = document.getElementById("app")
target.innerText = `Sum of 1 + 1 = ${sum(1, 1)}`
