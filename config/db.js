const mongoose = require('mongoose');

//Map global promises
mongoose.Promise = global.Promise;
//Mongoose Connect
mongoose
.connect('mongodb+srv://mariana:alexubago@pusherpoll-8aevv.mongodb.net/test?retryWrites=true&w=majority')
.then(() => console.log('CONNECTED'))
.catch(error => console.log(error));