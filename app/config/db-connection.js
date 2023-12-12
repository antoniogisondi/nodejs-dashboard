const { MongoClient } = require('mongodb');
const { EventEmitter } = require('events');

class DbConnection extends EventEmitter {

    mongoClient = new MongoClient(
        'mongodb://localhost:27017',
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    getConnection() {
        this.mongoClient.connect((err, mongodb) => {
            if (err) throw err;
            this.emit('dbConnection', {
                db: this.mongoClient.db('dashboard')
            });
            DbConnection.setInstance(mongodb);
        })
    }

    static setInstance(mongodb) {
        DbConnection.db = mongodb.db('dashboard');
        DbConnection.userCollection = DbConnection.db.collection('users');
    }
}

module.exports = DbConnection;