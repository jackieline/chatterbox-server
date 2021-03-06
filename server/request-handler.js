fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var messages = {
  results: [
    // username: 'jack',
    // text: 'im a bully',
    // roomname: 'lobby'
  ]
};



var counter = 5000;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  //use if statements to do different conditionals depending on what the request method is
  //get post options

  // The outgoing status.
  var statusCode = 200;
  var requestType = request.method;
  var headers = defaultCorsHeaders;
  

  //check if url works
  if (request.url !== '/classes/messages') {
    statusCode = 404;
    // response.end(null);
  } 
  
  if (requestType === 'OPTIONS') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  } 
  if (requestType === 'GET' && statusCode !== 404) {
    //Send messages back to the user   
    //implied messages are stored "somewhere"
    statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages));
    // fs.readF
    // console.log(messages.results[0], '!!!!!!!');
  } 
  if (requestType === 'POST' && statusCode !== 404) {
    // receive message from user   
    // add to message storage somehow
    
    var temp = [];
    statusCode = 201;
    request.on('data', (text) => {
      console.log(text, 'wefwefwefwefwefwefwefwef');
      temp.push(text);
    });
    request.on('end', () => {
      temp = Buffer.concat(temp).toString();
      console.log(temp, 'asdasdasdasd');
      //console.log('!!!!!!!!!!!',JSON.parse(temp));
      messages.results.push(JSON.parse(temp));
      fs.appendFile('/Users/student/hrsf85-chatterbox-server/server/dataFile.txt', temp);
      //receiving msgs from client
      //console.log(messages.results);
    });
    //console.log('=+++++++++++++++',messages.results);
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages.results));
  }
  

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //jackie put this in will prob use later
  // response.setHeader('Content-Type', 'application/json');
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.writeHead(statusCode, headers);
  // response.end(JSON.stringify(messages));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;
