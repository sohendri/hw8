import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import WebSocket from 'ws';

// enable CORS using npm package
import cors from 'cors';

const app = express();

const port = 4000;

let stockDataInfo;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/stocks/:stc', async(req, res) => {
    try {
        const stc = req.params.stc;
        // console.log(stc);
        const data = await search(stc);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
});

app.get('/stock/:ticker', async(req, res) => {
    try {
        const ticker = req.params.ticker;
        console.log("Symbol: " + ticker);
        const data = await searchOne(ticker);
        console.log("Data: " + ticker);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }

});

app.get('/watchlistStock/:ticker', async(req, res) => {
    try {
        const ticker = req.params.ticker;
        const data = await watchListStock(ticker);
        console.log("Watchlist: " + ticker);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }

});

app.get('/news/:ticker', async(req, res) => {
    try {
        const ticker = req.params.ticker;
        console.log("Symbol: " + ticker);
        const data = await searchNews(ticker);
        console.log("Data: " + ticker);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
});



let search = async(x) => {
    let dataArr = [];
    await fetch(`https:finnhub.io/api/v1/search?q=${x}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => (data.json()))
        .then(data => {
            data.result.forEach(element => {
                dataArr.push(element);
            });
        });
    return dataArr;
}

let searchOne = async(tkr) => {
    let tkrData = [];
    let timeNow = Math.floor(new Date().getTime() / 1000);
    let timeThen = Math.floor((new Date().getTime() - (24 * 60 * 60 * 1000)) / 1000);
    console.log()
    await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => (data.json()))
        .then(data => {
            console.log(data);
            tkrData.push(data);
        });
    await fetch(`https://finnhub.io/api/v1/quote?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            tkrData.push(data)
        });
    await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            tkrData.push(data)
        });
    await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${tkr}&resolution=5&from=${timeThen}&to=${timeNow}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            tkrData.push(data)
        });
    await fetch(`https://finnhub.io/api/v1/stock/social-sentiment?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0
    `)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            tkrData.push(data)
        });
    // console.log(tkrData);
    return tkrData;
}

let searchNews = async(tkr) => {
    let tkrNews = [];
    await fetch(`https://finnhub.io/api/v1/company-news?symbol=${tkr}&from=2021-09-01&to=2022-03-13&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => data.json())
        .then(data => {
            data.forEach((element, i) => {
                if (i < 10) {
                    tkrNews.push(element);
                }
            });
        });
    // console.log(tkrNews);
    return tkrNews;
}

let watchListStock = async(tkr) => {
    let tkrData = [];
    await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => (data.json()))
        .then(data => {
            // console.log(data);
            tkrData.push(data);
        });
    await fetch(`https://finnhub.io/api/v1/quote?symbol=${tkr}&token=c8j5bciad3ia1ri1dkk0`)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            tkrData.push(data)
        });
    console.log(tkrData);
    return tkrData;
}

// UNIX TIME
// Math.floor(new Date().getTime() / 1000)

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});