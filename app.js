var express = require('express');
var app = express();
app.use(express.json());
const axios = require('axios');
const mediumURL = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@"
const blogCard = require('./blogCard');

const getUserData = async (username) => {
  try {
    const result = await axios.get(mediumURL + username)
    const filteredResult = result.data.items.filter(function (item) {
      if (!item.thumbnail.includes('stat?event') || !item.thumbnail.includes('&referrerSource')) {
        return true
      } else {
        return false
      }
    });
    return filteredResult;
  } catch (error) {
    console.error(error);
    return error
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};

app.get('/', async (request, response) => {
  try{
    response.status(200).send(`<h2>Use the URL in following format</h2>
    <br/> <a href="https://mediumblog-cards.vercel.app/getMediumBlogs?username=harshalrj25">https://mediumblog-cards.vercel.app/getMediumBlogs?username=harshalrj25 </a><br/>
    <h3>Replace query parameter with your github username</h3>`)
  }catch (error){
    console.log(error);
    response.send('Error' + error);
  }
});

app.get('/getMediumBlogs', async (request, response) => {
  try {
    if (!request.query.username) {
      response.write(JSON.stringify({error: 'your medium username is require in the query string'}));
      response.end();
      return;
    }
    const username = request.query.username;
    let limit = 5;
    let type = 'vertical'
    if (request.query.type) {
      type = request.query.type;
    }
    if (request.query.limit) {
      limit = request.query.limit;
    }
    const resultData = await getUserData(username);
    let result = `<svg>`;
    if (type == 'horizontal') {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${resultData.length * 355}" version="1.2" height="105">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCard(blog);
        result += `<g transform="translate(${index * 355}, 0)">${blogCardObj}</g>`;
      });
    } else {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350" version="1.2" height="${resultData.length * 110}">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCard(blog);
        result += `<g transform="translate(0, ${index * 110})">${blogCardObj}</g>`;
      });
    }
    result += `</svg>`;
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.write(result);
    response.end();
  } catch (error) {
    console.log(error);
    response.send('Error while fetching the data' + error);
  }
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server listening' + port);
}); 