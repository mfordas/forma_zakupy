
import request from 'supertest';
import {app} from "./appStart.js";
import {dbConnect} from './dbConnection.js';

let server;

const runApp = async () => {
  
  await dbConnect(app)
  const port = process.env.PORT || 8080;
  server = app.listen(port, () =>
    console.log(`Listening on ${port}`)
  );

  const res = request(server)
  .get('/api/products')
  
  console.log(res.status);

  res.expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });


};

// if (process.env.NODE_ENV !=='test'){ 
  runApp();
  
// };


export {
  server
};