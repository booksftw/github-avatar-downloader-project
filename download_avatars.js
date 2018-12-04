var request = require('request');
var fs      = require('fs');
var secret  = require('./secret');

var repNameInput = process.argv[2];
var repOwnerInput = process.argv[3];

function getRepoContributors(repoOwner, repoName, callback) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization':secret.GITHUB_TOKEN
    }
  }

  request(options, function(err, res, body) {
    let resObj = JSON.parse(body);
    callback(err, resObj);
  });
}

function downloadImageByURL(avatarUrl, filePath){

  console.log(avatarUrl, filePath);
  // avatarUrl = 'https://avatars2.githubusercontent.com/u/2741?v=3&s=466';
  // filePath = "avatars/kvirani.jpg"

  request.get(avatarUrl)
         .on('error', function(err){
            throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

if (repNameInput || repOwnerInput) {
  console.log('Valid User Input');
  getRepoContributors(repOwnerInput, repNameInput, function(err, result){
    for (variable in result) {
      let el = result[variable];
      let avatarUrl = el.avatar_url;
      let filePath = `avatars/${el.login}.jpg`;
      downloadImageByURL(avatarUrl, filePath);
    }
  })
} else {
  console.error('Invalid user input');
}
