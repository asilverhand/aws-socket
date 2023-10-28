const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })

const PORT = 3001

app.get("/", (req, res, next) => {
  res.json({
    count: io.eio.clientsCount
  });
});



io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);
  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id)
  })

  socket.on('set_username', username => {
    socket.data.username = username
    console.log('user_name', socket.data)
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    })
  })

  setInterval(() => {
    io.emit('users', {
      count: io.eio.clientsCount
    })
  }, 5000);
})

server.listen(PORT, () => console.log('Server running...'))