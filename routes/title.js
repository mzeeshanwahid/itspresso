const express = require("express");
const router = express.Router();
const axios = require("axios");
const HTMLParser = require("node-html-parser");

router.get("/", async (req, res) => {
  let url = req.query.address;
  if (!url) return res.status(400).send("Invalid Parameters!");

  url = "http://" + url.toString();
  if (url.indexOf(" ") != -1) return res.status(400).send("Invalid URL!");

  let responseCode = await axios.get(url);
  if (!responseCode) return res.status(400).send("Invalid URL!");

  let rawHTML = HTMLParser.parse(responseCode.data);
  // CSS
  let style = rawHTML.querySelectorAll("link");
  let stylesheets = style.filter(link => {
    return link.rawAttrs.toString().indexOf('rel="stylesheet"') != -1;
  });

  let hrefs = stylesheets.map(style => {
    let chunks = style.rawAttrs.toString().split(" ");

    return chunks.filter(chunk => {
      return chunk.indexOf("href") != -1;
    });
  });

  let linksOnly = hrefs.map(href => {
    let link = href.toString();
    link = link.substring(6, link.length - 1);
    return link;
  });

  //JS
  let js = rawHTML.querySelectorAll("script");

  let srcs = js.map(jstag => {
    let chunks = jstag.rawAttrs.toString().split(" ");

    return chunks.filter(chunk => {
      return chunk.indexOf("src") != -1;
    });
  });

  let srcOnly = srcs.filter(src => {
    return src != "";
  });

  srcOnly = srcOnly.map(src => {
    let link = src.toString();
    link = link.substring(5, link.length - 1);
    return link;
  });

  console.log("JS", srcOnly);

  res.status(200).render("index", {
    website: req.query.address,
    stylesheets: linksOnly,
    javascripts: srcOnly
  });
});

module.exports = router;
