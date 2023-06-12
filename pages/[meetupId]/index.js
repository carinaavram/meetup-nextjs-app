//our-domain.com/meetupId(dinamic)
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { Fragment } from 'react';
import Head from 'next/head';

export default function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb+srv://carinaavram97:${process.env.REACT_APP_PASSWORD}@cluster0.xvttyqf.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();

  //collection are tables, documents are entries in those collection
  const meetupsCollection = db.collection('meetups');
  //find gives access to all the meetups. The first parameter of find is a filer, and the second defines which fields will be extracted.
  //the line below tells that we only want to fetch the id field, nothing else.
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    //we decribe the dinamic segment values
    //generate the array of paths dinamically
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup
  //here context will have a params
  //context.params will have the path encoded in the URL
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    `mongodb+srv://carinaavram97:${process.env.REACT_APP_PASSWORD}@cluster0.xvttyqf.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();

  //collection are tables, documents are entries in those collection
  const meetupsCollection = db.collection('meetups');
  //find gives access to all the meetups. The first parameter of find is a filer, and the second defines which fields will be extracted.
  //the line below tells that we only want to fetch the id field, nothing else.
  //findOne finds only one document and inside we specify the field and the values that needs to equal to.
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
