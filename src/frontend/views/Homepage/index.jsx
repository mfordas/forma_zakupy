import React from 'react';
import HomepageContent from '../../components/Homepage/HomepageContent';
import UserBox from '../../components/Homepage/UserBox';
import { Container } from 'semantic-ui-react';

const Home = () => {
  
  return (
    <div>
      <HomepageContent />
      <Container style={{margin: '10px'}}>
        <UserBox />
      </Container>
    </div>
  );
};

export default Home;



