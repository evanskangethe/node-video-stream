//require modules
const fs = require('fs');
const app = require('express')();
const http = require('http').Server(app);
const PORT = process.env.PORT || 4000;
const log = console.log;

app.get('/video/:name',(req,res)=>{
  //get file stat
  const path = `./videos/Travaho/Travaho.webm`;
  const stat = fs.statSync(path)
  const file_size = stat.size
  const range = req.headers.range

  //check header for range
  if (range) {
    const parts = range.replace(/bytes=/,'').split('-');
    const start = parseInt(parts[0],10)
    const end = parts[1]?parseInt(parts[1],10):file_size-1
    chunk = (end - start)+1
    const file = fs.createReadStream(path,{start,end})

    //make the header file
    const head = {
      'Content-Range': `bytes ${start}-${end}/${file_size}`,
      'Accept-Ranges': `bytes`,
      'Content-Length': `${chunk}`,
      'Content-Type': `video/webm`
    }

    //give the response
    res.writeHead(206,head)
    file.pipe(res)
  } else {
    //initialize streaming of data
    const head = {
      'Content-Length': `${file_size}`,
      'Content-Type': `video/webm`
    }

    res.writeHead(200,head)
    fs.createReadStream(path).pipe(res)
  }
})

http.listen(PORT,()=>log(`server connected to http://localhost:${PORT}`))
