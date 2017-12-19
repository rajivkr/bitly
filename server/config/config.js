var env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
    process.env.PORT = 3000;
    process.env.MONGOLAB_BLACK_URI = "mongodb://localhost:27017/TodoApp";
    process.env.FRONT_URL = 'http://localhost:3000/'
}