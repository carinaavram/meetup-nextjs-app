//our-domain.com/new-meetup
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import Head from 'next/head';

import NewMeetupForm from '../../components/meetups/NewMeetupForm';

export default function NewMeetupPage() {
  const router = useRouter();

  const onAddMeetupHandler = async (enteredMeetupData) => {
    //here is an internal api
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      //we have to convert it to json
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log(data);

    router.push('/');
  };

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name="description"
          content="Add your own meetups, create amazing newtworking opportunities."
        />
      </Head>
      <NewMeetupForm onAddMeetup={onAddMeetupHandler} />
    </Fragment>
  );
}
