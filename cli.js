const Snake = require('./snake')
const base  = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

let State = Snake.initialState()

const show = () => console.log(
  '\x1Bc' + Matrix.toString(Matrix.fromState(State)))

const step = () =>
  State = Snake.next(State)

// Matrix operations
const Matrix = {
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake:  state => pipe(...map(Matrix.set('X'))(state.snake)),
  addApple:  state => Matrix.set('o')(state.apple),
  addCrash:  state => state.snake.length == 0 ? map(map(k('|'))) : id,
  toString:  xsxs => xsxs.map(xs => xs.join(' ')).join('\r\n'),
  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
  )(state)
}

// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
let stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')
stdin.on('data', function(key) {
  if (key === '\u0003') process.exit() // ctr-c
  switch (key.toUpperCase()) {
    case 'W': case 'K': State = Snake.enqueue(State, Snake.NORTH); break
    case 'S': case 'J': State = Snake.enqueue(State, Snake.SOUTH); break
    case 'D': case 'L': State = Snake.enqueue(State, Snake.EAST);  break
    case 'A': case 'H': State = Snake.enqueue(State, Snake.WEST);  break
  }
})

setInterval(() => { step(); show() }, 80)

