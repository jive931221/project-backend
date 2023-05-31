const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/note-db-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is Connected'))
    .catch(err => {
        console.error('DB connection error:', err);
    });


