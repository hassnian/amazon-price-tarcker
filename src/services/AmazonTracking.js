const trackingProducts = require('../../tracking.json')
const moment = require("moment")
const puppeteer = require('puppeteer')
const SMS = require("./SMS")

moment.locale();         // en


class  AmazonTracking {
    constructor(time){
        this.time = time
        this.NOT_FOUND = "NOT_FOUND"
        this.signFirst = false
        this.SMS = new SMS()
    }

    checkProducts(){
        trackingProducts.forEach(async product => {
            console.log("checking " + product.productName, moment().format('LTS'))
            await this.checkPrice(product)
        });

        setTimeout(() => {
            this.checkProducts()
        }, this.time);
    }
    

    async checkPrice(product){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(product.amazonUrl);


        const amazonPrice = await this.getAnyValidPrice(page)
        
        if(!amazonPrice){
            console.log(`${product.productName } ${this.NOT_FOUND}`)
            await this.closeBrowser(browser)
            return
        }

      if(this.isPriceLowerOrEqual(amazonPrice.value , product.price)){
          this.SMS.sendSMS(`Product: ${product.productName} grab it : ${ product.amazonUrl}`)
      }
        console.log(this.isPriceLowerOrEqual(amazonPrice.value , product.price) );
    

        await this.closeBrowser(browser)
   
    }

    isPriceLowerOrEqual(amazonPrice, desiredPrice ){
        return amazonPrice <=  desiredPrice
    }

    async getAnyValidPrice(page){
        const dealPrice = await this.getPriceFromPage('#priceblock_dealprice', page )
        if(!dealPrice){
            return await this.getPriceFromPage('#priceblock_ourprice', page )
        }
        return dealPrice

    }

    async getPriceFromPage(selector, page){
        const itemPrice =  await this.getElement(selector, page )

        if(!itemPrice){
            return null
        }
        return this.getPriceObject(itemPrice)

    } 

    getPriceObject(price){
        const priceWIthSign = price.split(/\s+/g)

        if(this.signFirst){
            return { value : parseFloat( priceWIthSign[1] ), sign:  priceWIthSign[0]  }
        }
        return { value :parseFloat( priceWIthSign[0] ), sign: priceWIthSign[1]  }
    }

    async getElement(selector, page){
        try{
           const response =  await page.$eval(selector, el => el.innerText)
           return response
        } catch(error){
            return null
        }
    }


    async closeBrowser(browser){
        await browser.close()
    }



}

module.exports = AmazonTracking