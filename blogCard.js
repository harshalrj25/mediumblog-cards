const axios = require('axios');

const getBase64 = async (url) => {
  return await axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

const blogCard = async (data, userIcon, mediumIcon) => {
let regex = /<img[^>]+src="([^">]+)"/i;
let match = data.description.match(regex);
let imageUrl = match ? match[1] : null;
  const blogImage = await getBase64(imageUrl);
  const blogDate = new Date(data.pubDate).toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric' })
  const blogLink = data.link;
  return `
    <svg x="10" y="10" class="shadow" height="105px" width="345px">
    <defs>
    <style type="text/css"><![CDATA[
      .shadow {
        margin:2px;
        -webkit-filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.9));
        filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.9));
      }     
    ]]></style>
  </defs>
    <defs>
    <!-- define lines for text lies on -->
    <path id="blogName" d="M0,20 H235 M0,35 H235 M0,50 H240 M0,65 H235">     </path>
      <path id="blogAuthor" d="M25,80 H230 ">     
      </path>
      <path id="blogDate" d="M25,95 H230 ">     
      </path>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(206,108,9);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(248,212,176);stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
    <stop offset="100%" style="stop-color:rgb(22,22,22);stop-opacity:1" />
  </linearGradient>
   </defs>
   <a href="${blogLink}" target="_blank">
   <rect x="0" y="0" width="100%" height="100%" style="fill:url(#grad1)"></rect>
   <text text-decoration="underline" transform="translate(100,0)" fill="white" font-size="13" font-family="Arial, Helvetica, sans-serif">
    <textPath xlink:href="#blogName">${data.title}</textPath>
   </text>
   <rect x="5" y="10" height="85px" width="90px" style="fill:url(#grad2);stroke-width:0.5;stroke:rgb(255,255,255)"></rect>
       <image xlink:href="data:image/png;base64,${blogImage}"  x="5" y="10" height="85px" width="90px" />
   <image x="95" y="70" href="data:image/png;base64,${userIcon}" height="25" width="25"/>
       <text transform="translate(100,0)" fill="dark gray" font-size="13">
    <textPath xlink:href="#blogAuthor">${data.author}</textPath>
   </text>
   <image x="315" y="75" href="data:image/png;base64,${mediumIcon}" height="25" width="25"/>
   <text transform="translate(100,0)" fill="dark gray" font-size="12">
    <textPath xlink:href="#blogDate">${blogDate}</textPath>
   </text>
   </a>
  </svg>
    `;
};

module.exports = blogCard;