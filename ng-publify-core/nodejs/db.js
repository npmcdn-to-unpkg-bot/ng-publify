var mongodb = require('mongodb');

module.exports = class Db {
    constructor(app, url) {
        this.url = url;
        var self = this;
        
        console.log('Establishing connecting to database', url);
        this.mongoClient = mongodb.MongoClient;
        
        this.mongoClient.connect(this.url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to database', url);
                self.db = db;
                
                // Create database and initial values if it doesn't exist
                db.collection('content').insertOne({
                    _id: '1234-5678-9012-00',
                    containers: {
                        main: {
                            containers: {

                            },
                            editables: {
                                error_text: 'Error text from server'
                            },
                            modules: {
                                'm_5499-0094-5301-24': {
                                    getOn: 2,
                                    data: {

                                    }
                                },
                                'm_8492-1823-8973-01': {
                                    getOn: 1
                                }
                            }
                        }
                    }
                }, function(err, result) {
                    console.log("Inserted a document into the content collection.");
                });
                
                // Call dbInit on all modules
                
            }
        });
    }
    
    get(query, callback) {
        this.db.collection('content').findOne(query, function(err, doc) {
            if(err) console.log(err);
            
            callback(doc);
        });
    }
    
    set(query, newData, callback) {
        this.db.collection('content').replaceOne(query, newData, function(err, results) {
            if(err) console.log(err);
            
            callback(results);
        });
    }
};