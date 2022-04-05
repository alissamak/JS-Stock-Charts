//assigns bar/line/pie colors to stock name
function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

//calculates the highest stock value
function findHighest(values){
    let highest = 0;
    values.forEach(value => {
        if(parseFloat(value.high) > highest){
            highest = value.high;
        }
    })
    return highest;
}

//calculates the average stock value
function calcAverage(values){
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    let average = total / values.length
    return average;
}

async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    
    // comment out live data if needed
    const request = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=ae79c0a674ab48ec9f9ecd1a3c06bdf3');
    const result = await request.json();
    console.log(result);
    
    const {GME, MSFT, DIS, BNTX} = result;
    // const {GME, MSFT, DIS, BNTX} = mockData;
    const stocks = [GME, MSFT, DIS, BNTX];
    
    //reverses date order from oldest to most recent left to right
    stocks.forEach(stock => stock.values.reverse());

    //Chart 1 Stock Price Over Time
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    //Chart 2 Highest Stock Price
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (getColor(stock.meta.symbol))),
                borderColor: stocks.map(stock => (getColor(stock.meta.symbol))),
                data: stocks.map(stock => (findHighest(stock.values))),
            }],
        }
    });

    //Chart 3 Average Stock Price
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (getColor(stock.meta.symbol))),
                borderColor: stocks.map(stock => (getColor(stock.meta.symbol))),
                data: stocks.map(stock => (calcAverage(stock.values))),
            }],
        }
    });    
}

main()