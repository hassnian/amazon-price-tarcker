const trackingProducts = require('../../tracking.json')
const moment = require("moment")
moment.locale();         // en

const puppeteer = require('puppeteer');

class  AmazonTracking {
    constructor(time){
        this.time = time
    }


    async openBrowser(website){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(website);
        await page.screenshot({path: 'example.png'});
        
        await browser.close();
   
    }


    checkProducts(){
        trackingProducts.forEach(async product => {
            await this.openBrowser(product.amazonUrl)
            console.log(product.productName, moment().format('LTS'))
        });

        setTimeout(() => {
            this.checkProducts()
        }, this.time);
    }


}

module.exports = AmazonTracking