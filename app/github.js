var github = require('github-api');

console.log("GIT GO");

var github = new Github({
  username: "vahaknp",
  password: "1papazian",
  auth: "basic"
});

var repo = github.getRepo(vahaknp, Ripple);

repo.contents("/", function(err, contents) {
	console.log('SUCCESS');
});