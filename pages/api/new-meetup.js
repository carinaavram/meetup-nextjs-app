import {MongoClient}  from 'mongodb'
//here you don't create a react component, we'll define functions that contain server-side 
//we can use credentials here without compromising them
// /api/new-meetup
//the function receives req, res
//ensures only post requests to thsi route will trigger requests

async function handler (req, res) {
    if (req.method === 'POST') {
        const data = req.body;

        //store them in a database (data)- MongoDB - create account and start a cluster
        const client = await MongoClient.connect( `mongodb+srv://carinaavram97:${process.env.REACT_APP_PASSWORD}@cluster0.xvttyqf.mongodb.net/meetups?retryWrites=true&w=majority`);
        const db= client.db();

        //collection are tables, documents are entries in those collection
        const meetupsCollection = db.collection('meetups');

        //a document is an object
        //insertOne also return a promise
        const result = await meetupsCollection.insertOne(data);

        console.log(result);

        //we want to close the db once we're done
        client.close();

        //send back a response
        res.status(201).json({message: 'Meetup inserted!'});
        //now we have to connect the front-end to this backend
    }
}

export default handler;

