const fs = require('fs');

const express = require('express');
const path = require('path');

const router = express.Router();

let uploads = Object.create(null);

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Test get request has been received');
  res.status(200).send('Ok');
})

router.post('/upload', (req, res) => {

  let file_id = req.headers['file_id'];
  let start_byte = +req.headers['start_byte'];

  if(!file_id) {
    console.log('File id is not present');
    req.removeListener('data', get_data); // remove the event listeners
    req.removeListener('end', req_end);
    res.header('Connection', 'close'); // node will automatically close the connection
    res.send(400, 'File id not found'); // send response to the client
    return;
  }

  file_path = path.join(path.resolve('./'), '/temp/' + file_id);
  console.log(file_path);

  if(!uploads[file_id]) uploads[file_id] = {}; //if this is a new file then add it to list

  let upload = uploads[file_id] // initialize the upload

  let writer;

  if(!start_byte) {
    upload.bytesReceived = 0;
    writer = fs.createWriteStream(file_path, {
      flag: 'w' // new file upload open in write mode
    });
  }
  else {
    if(upload.bytesReceived != start_byte) {
      req.removeListener('data', get_data); // remove the event listeners
      req.removeListener('end', req_end);
      res.header('Connection', 'close'); // node will automatically close the connection
      res.writeHead(400, 'Wrong start byte');
      res.send(upload.bytesReceived); // send the correct start byte to client
      return;
    }

    // append the content in existing file present in server
    writer = fs.createWriteStream(file_path, {
      flags: 'a'
    });
  }

  req.pipe(writer);

  writer.on('close', () => {
    // further error checking goes here
    delete uploads[file_id];
    res.send('File is successfully received at server');
  });

  // here we may also check for I/O error

  var get_data = function(data) {
    upload.bytesReceived += data.length; // update the bytes received by the server
    console.log(`File is being processed... Bytes received ${data.length}`);
  }

  var req_end = function() {
    console.log('Request has ended');
  }

  req.on('data', get_data);
  req.on('end', req_end);
});

router.get('/curr_byte', (req, res) => {
  let file_id = req.headers['file_id'];

  if(!file_id) res.status(400).send('File ID is not present in header');

  let upload = uploads[file_id];

  if(!upload) res.status(200).send('0');
  else res.status(200).send(upload.bytesReceived.toString());

  console.log(upload);
})

router.get('/cancel_upload', (req, res) => {
  let file_id = req.headers['file_id'];

  if(!file_id) res.status(400).send('File ID is not present in header');

  if(!uploads[file_id]) {
    res.status(200).send('There is no pending download');
    console.log('There is no pending download'); // remove if not necessary. kept only as a prrof of concept
  }
  else {
    delete uploads[file_id];
    res.status(200).send('Your pending upload has been cancelled');
    console.log('Your pending upload has been cancelled'); // remove if not necessary. kept only as a prrof of concept
  }
})
module.exports = router;
