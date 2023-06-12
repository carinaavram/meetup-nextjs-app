//this is the main page
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

//We want to fetch from database.

function HomePage(props) {
  //The first time we render this page, our meetups will be an emtpy array. Afterwards, they will be loaded once we fetch the data with useEffect

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps (context) {
//     const req = context.req;
//     const res = context.res;

//     //fetch data from API, it will always run in the server
//     //no revalidation needed here
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };
// }

//This function is called before the component function
export async function getStaticProps() {
  //this code will not end up in the client-side
  //Any code here will never execute in the client-side server
  //fetch data from an API or database
  //You ALWAYS need to return an object
  //this code will fetch data from our database and load it
  const client = await MongoClient.connect(
    `mongodb+srv://carinaavram97:${process.env.REACT_APP_PASSWORD}@cluster0.xvttyqf.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();

  //collection are tables, documents are entries in those collection
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  //close the connection
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
