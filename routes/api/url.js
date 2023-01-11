const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../../models/URL');

//@route POST /api/url/shorten
//@desc Create Short URL
router.post('/shorten', async (req,res) =>{
    
    const {longUrl} = req.body;
    const baseUrl = config.get('baseURL');

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('invalid base url');
    }

    // create url code
    const urlCode = shortid.generate();

    // check long code
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({longUrl})

            if (url) {
                res.json(url);
            } else {;
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
                  longUrl,
                  shortUrl,
                  urlCode,
                  date: new Date(),
                });
                res.json(url);
                await url.save();
                
              }
        } catch (error) {
            console.log(error);
            res.status(500).json('server error');
        }
    } else {
        res.status(401).json('Invalid long url');
    }
})


module.exports = router;