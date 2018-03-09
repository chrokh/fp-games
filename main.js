const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
const dropFirst = xs => xs.slice(1)
const dropLast  = xs => xs.slice(0, xs.length - 1)
const id        = x => x
const join      = x => xs => xs.join(x)
const k         = x => y => x
const map       = f => xs => xs.map(f)
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
const mod       = x => y => ((y % x) + x) % x // http://bit.ly/2oF4mQ7
const o         = (...fns) => x => pipe(...reverse([...fns]))(x)
const objOf     = k => v => { var o = {}; o[k] = v; return o }
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const pointEq   = p1 => p2 => p1.x == p2.x && p1.y == p2.y // TODO: Generalize to objEq
const prop      = k => o => o[k]
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep       = c => n => map(k(c))(range(0)(n))
const reverse   = xs => xs.reverse()
const spec      = o => x =>
  Object.keys(o).
    map(k => objOf(k)(o[k](x))).
    reduce((acc, o) => Object.assign(acc, o))


//
// Constants
//

const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }


//
// State inspection
//

const eatsApple   = state => pointEq(state.snake[0])(state.apple)
const willCollide = state => state.snake.find(pointEq(nextHead(state)))


//
// Next prop from current state
//

const nextHead = state => ({
  x: mod(state.cols)(state.snake[0].x + state.moves[0].x ),
  y: mod(state.rows)(state.snake[0].y + state.moves[0].y ),
})

const nextMoves = state => state.moves.length > 1
  ? dropFirst(state.moves)
  : state.moves

const nextSnake = state =>
  willCollide(state)
    ? [{ x: 2, y: 2 }]
    : (eatsApple(state)
      ? [nextHead(state)].concat(state.snake)
      : [nextHead(state)].concat(dropLast(state.snake)))

const nextApple = state => eatsApple(state)
  ? rndPos(state)
  : state.apple


//
// Grid functions
//

const Grid = {
  grid:  rows => cols => rep(rep('.')(cols))(rows),
  make:  state => Grid.grid(state.rows)(state.cols),
  set:   c => pos => adjust(pos.y)(adjust(pos.x)(k(c))),
  print: pipe(map(x => x.join(' ')), join('\r\n'))
}


//
// Randomness
//

const rnd = min => max => Math.floor(Math.random() * max) + min
const rndPos = grid => ({
  x: rnd(0)(grid.cols - 1),
  y: rnd(0)(grid.rows - 1)
})


//
// Grid adders
//

const addSnake     = state => pipe(...map(Grid.set('X'))(state.snake))
const addApple     = state => Grid.set('o')(state.apple)
const addCollision = state => willCollide(state) ? map(map(k('|'))) : id


//
// Initial state
//

let State = {
  cols:  20,
  rows:  14,
  moves: [EAST],
  snake: [{ x: 2, y: 2 }],
  apple: { x: 16, y: 2 },
}


//
// Game loop
//

const setup = input => output => {
  input(move => State.moves = State.moves.concat([move]))
  setInterval(pipe(update, show(output)), 125)
}

const show = out => () => out(print(State))
const print = state => pipe(
  Grid.make,
  addSnake(state),
  addApple(state),
  addCollision(state),
  Grid.print,
)(state)

const update = () => State = next(State)
const next = spec({
  rows:  prop('rows'),
  cols:  prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple
})


//
// CLI specifics
//

const cliPrinter = s =>
  process.stdout.write('\x1Bc' + s)

const cliListener = f => {
  // https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
  var stdin = process.stdin
  stdin.setRawMode( true )
  stdin.resume()
  stdin.setEncoding( 'utf8' )
  stdin.on('data', function(key) {
    if (key === '\u0003') process.exit() // ctr-c
    switch (key.toUpperCase()) {
      case 'W': case 'K': f(NORTH); break
      case 'S': case 'J': f(SOUTH); break
      case 'D': case 'L': f(EAST);  break
      case 'A': case 'H': f(WEST);  break
    }
  })
}


//
// Main
//

setup(cliListener)(cliPrinter)

