# memecycle-backend

Simple express.js app that allows for the storage and retrieval of images along with .FIT and .GPX files.

## Deploy
This is very rudimentary at this point.  But I have it setup so that you can launch this thing with different `CORS_ORIGIN` values.

### Dev mode
Dev mode will allow connections from `http://localhost.com:3000`

Launch via
`docker-compose up --build`

This is going to get a lot better.  For example I should probably not be using --build and instead should
map a volume and start a watch on that code or something.

### Production mode
Production mode will allow connections from `https://memecycle.finalatomicbuster.net`

Launch via
`docker-compose -f docker-compose.yml up --build`