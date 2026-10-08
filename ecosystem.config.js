module.exports = {
  apps: [
    {
      name: "haatsign-landing",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3050",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
