const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
const dropFirst = xs => xs.slice(1)
const dropLast  = xs => xs.slice(0, xs.length - 1)
const id        = x => x
const k         = x => y => x
const map       = f => xs => xs.map(f)
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
const merge     = o1 => o2 => Object.assign({}, o1, o2)
const mod       = x => y => ((y % x) + x) % x // http://bit.ly/2oF4mQ7
const objOf     = k => v => ({ [k]: v })
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const prop      = k => o => o[k]
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep       = c => n => map(k(c))(range(0)(n))
const rnd       = min => max => Math.floor(Math.random() * max) + min
const spec      = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

module.exports = { adjust, dropFirst, dropLast, id, k, map, merge, mod, objOf, pipe, prop, range, rep, rnd, spec }
