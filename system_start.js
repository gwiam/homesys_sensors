{
  "apps" : [{
    "name"        : "Homesys server",
    "script"      : "./index.js",
    "watch"       : false,
    "env": {
      "NODE_ENV": "development"
    },
    "env_production" : {
       "NODE_ENV": "production"
    }
  }]
}
