const puppeteer = require('puppeteer');
var http = require('http')
var SSE = require('sse')

var port = 4000
var val = 0

function onDigits(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache'
  });

  var i = 0;

  var timer = setInterval(write, 1000);
  write();

  function write() {
    i++;

    if (i == 4) {
      res.write('event: bye\ndata: до свидания\n\n');
      clearInterval(timer);
      res.end();
      return;
    }

    res.write('data: ' + i + '\n\n');

  }
}

function accept(req, res) {
  onDigits(req, res);
  return;
}

const server = http.createServer(accept)

server.listen(port, err => {
  if (err) {
    console.log(err)
  }

  var sse = new SSE(server)
  sse.on('connection', function(client) {
    client.send('hi')
  })

  console.log(`you on port ${port}`)
})
// async function getData() {
//   try {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto('https://dota2.ru', { waitUntil: 'networkidle2'});

//     const matchesSelector = '.m-matches .item'
//     const showResultSelector = '.m-matches .item .team-vs-team .status i.show-result'
//     await page.waitForSelector(showResultSelector)
//     const matches = await page.$$(showResultSelector)
    
//     for(let i = 0; i < matches.length; i++) {
//       await page.click(showResultSelector)
//     }

//     const data = await page.evaluate(() => {
//       const resultData = Array.from(document.querySelectorAll('.m-matches .item .team-vs-team .status .score'))
//       const arr = []
//       resultData.map(score => {
//         if (score) {
//           arr.push(score.innerHTML)
//         }
//       })

//       return arr
//     })

//     console.log(data)

//     await browser.close();
//   } catch (err) {
//     console.log(err)
//   }
// }

// getData()