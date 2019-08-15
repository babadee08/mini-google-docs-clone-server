const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

/* app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
}); */

const groupData = {};

let value = {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: 'A line of text in a paragraph....',
            },
          ],
        },
      ],
    },
  };

io.on('connection', function(socket){
    // console.log('a user connected');
    /* socket.on('send-value', () => {
        io.emit('init-value', value); 
    }); */

    socket.on('new-operations', (data) => {
        // console.log(data.value);
        groupData[data.groupId] = data.value;
        io.emit(`new-remote-operations-${data.groupId}`, data);
    })
    
});

app.use(cors());

app.get('/groups/:id', (req, res) => {
    const {id} = req.params;

    if (!(id in groupData)) {
        groupData[id] = value;
    }
    res.send(groupData[id]);
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});
