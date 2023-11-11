import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

export const router = express.Router();

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const isValidURL = (value) => {
    try {
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  app.get( "/filteredimage", async ( req, res ) => {
    let { author } = req.query;
  
    let image_url = req.query.image_url
    if (isValidURL(image_url)) {
      let filteredpath = await filterImageFromURL(image_url)
      res.status(200).sendFile(filteredpath, (err) => {
        if (err) {
          console.error(err);
          res.status(err.status).end();
        } else {
            deleteLocalFiles([filteredpath])
        }
      })
    } else {
      res.status(400).json({ error: 'Invalid image_url format' });
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
