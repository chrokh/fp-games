const base = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// Constants
const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }

// Point operations
const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y

// Booleans
const willEat   = state => pointEq(nextHead(state))(state.apple)
const willCrash = state => state.snake.find(pointEq(nextHead(state)))
const validMove = move => state =>
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0

// Next values based on state
const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
const nextApple = state => willEat(state) ? rndPos(state) : state.apple
const nextHead  = state => state.snake.length == 0
  ? { x: 2, y: 2 }
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
  }
const nextSnake = state => willCrash(state)
  ? []
  : (willEat(state)
    ? [nextHead(state)].concat(state.snake)
    : [nextHead(state)].concat(dropLast(state.snake)))

// Randomness
const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})

// Initial state
const initialState = () => ({
  cols:  20,
  rows:  14,
  moves: [EAST],
  snake: [],
  apple: { x: 16, y: 2 },
})

const next = spec({
  rows:  prop('rows'),
  cols:  prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple
})

const enqueue = (state, move) => validMove(move)(state)
  ? merge(state)({ moves: state.moves.concat([move]) })
  : state

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
