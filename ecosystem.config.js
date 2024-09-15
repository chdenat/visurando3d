module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }],

  // Deployment Configuration
  deploy : {
    production : {
      "user" : "p5077",
      "host" : '91.207.254.129',
      "ref"  : "origin/main",
      "repo" : "git@github.com:lgs1920/studio.git",
      "path" : "/home/www/lgs1920/studio/source/studio",
      "post-deploy" : "bun install"
    }
  }
}
