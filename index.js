const puppeteer = require("puppeteer");
const cron = require("node-cron");
const $ = require("cheerio");
const fs = require('fs');
const url =
  "https://www.amazon.com/Dell-27-Inch-LED-Lit-Monitor-S2719DGF/dp/B00N2L5CXO/ref=sr_1_1?dchild=1&keywords=dell+27+inch+monitor+2k+gaming+monitor&qid=1604973653&sr=8-1";

async function configureBrowser() {
  console.log("Webscraping has started...")
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function checkPrice(page) {
  let html = await page.evaluate(() => document.body.innerHTML);

  $("#priceblock_ourprice", html).each(function () {
    let info = $("#productTitle", html).text().replace(/\s\s+/g, " ");
    //let infotext = info.text().replace(/\s\s+/g, " ");
    let dollarPrice = $(this).text();
    // let currentPrice = Number(dollarPrice.replace(/[^0-9,-]+/g, "")); // regular expression that converts text to number

    if (dollarPrice < 600) {
      let result = "";
      result = "Hey man, this thing is on sale!!!" + dollarPrice;
    } else {
      result = "No sale for you:" + info + dollarPrice;
    }
  });
 fs.writeFile('./prices.json',JSON.stringify(result), err => err ? console.log(err) : null);
}

async function startTracking() {
  const page = await configureBrowser();
  checkPrice(page);
}

startTracking();

//Below is time keeping function and CRON Scheduler

// function currentDateTime() {
//   //Makes time stamp of current date in mm/dd/yyyy format
//   let today = new Date();
//   let dd = today.getDate();
//   let mm = today.getMonth() + 1;
//   let yyyy = today.getFullYear();
//   let minutes = today.getMinutes();
//   let hours = today.getHours();
//   let time = hours + ":" + minutes;

//   if (dd < 10) {
//     dd = "0" + dd;
//   }
//   if (mm < 10) {
//     mm = "0" + mm;
//   }
//   if (minutes < 10) {
//     minutes = "0" + minutes;
//   }
//   if (hours < 10) {
//     hours = "0" + hours;
//   }
//   today = mm + "/" + dd + "/" + yyyy;

//   return today + " " + time;
// }
// cron.schedule(" 0 */1 * * *", function () {
//   //shcedules job to go off every 1 hour
//   startTracking();
//   console.log("Job Finished " + currentDateTime());
// });

// /*async function monitor() {
//   let page = await configureBrowser();
//   await checkPrice(page);
// }*/

// // FIGURE OUT HOW TO EXPORT TO SLACKBOT
// // --> Figure out how to schedule request in SLACKBOT. MAY NEED TO INITIALIZE EVERYHOUR
