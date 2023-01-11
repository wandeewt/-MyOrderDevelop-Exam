const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
 
const app = express();

const router = express.Router();

const Url = require('./models/URL');

connectDB();
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/api/url', require('./routes/api/url'));

// @routes GET /:code
// @desc Redirect to long/oginal url
app.get('/:code', async (req, res) => {
    try {
      const url = await Url.findOne({ urlCode: req.params.code });
      
      if (url) {
        return res.redirect(url.longUrl);
      } else {
        return res.status(404).json('No url found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('server error');
    }
  });

// Set static folder
app.use(express.static(path.join(__dirname, 'public',)))

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`server ${PORT}`));
