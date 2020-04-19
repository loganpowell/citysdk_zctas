// keep unit tests close to the functions they test (i.e.,
// in the same directory)
import { sum, product, bloop, bleep, blop } from "./sum"

test("should ", () => {
  expect(sum(1, 2)).toBe(3)
})

test("product", () => {
  expect(product(10, 20)).toBe(200)
})

test("bloop", () => {
  expect(bloop).toBe("bloop")
})

test("bleep", () => {
  expect(bleep).toBe("bleep")
})

test("blop", () => {
  expect(blop).toBe("blop")
})
