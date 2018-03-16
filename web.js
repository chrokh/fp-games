const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let state = initialState()

const x = c => Math.round(c * canvas.width / state.cols)
const y = r => Math.round(r * canvas.height / state.rows)

const draw = () => {
  // clear
  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw snake
  ctx.fillStyle = 'rgb(0,200,50)'
  state.snake.map(p => {
    ctx.fillRect(x(p.x), y(p.y), x(1), y(1))
  })

  // draw apples
  ctx.fillStyle = 'rgb(255,50,0)'
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1))

  // add crash
  if (state.snake.length == 0) {
    ctx.fillStyle = 'rgb(255,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}


const step = t1 => t2 => {
  if (t2 - t1 > 100) {
    state = next(state)
    draw()
    window.requestAnimationFrame(step(t2))
  } else {
    window.requestAnimationFrame(step(t1))
  }
}

document.onkeypress = e => {
  switch (e.keyCode) {
    case 119: case 104: state = enqueue(state, NORTH); return
    case 97:  case 106: state = enqueue(state, WEST);  return
    case 115: case 107: state = enqueue(state, SOUTH); return
    case 100: case 108: state = enqueue(state, EAST);  return
  }
}

draw()
window.requestAnimationFrame(step(0))
