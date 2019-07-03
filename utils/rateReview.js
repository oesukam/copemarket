exports.rateReview = (reviews) => {
    
  let rates = 0;
  let rate = 0;
  let ratesCount = 0;
  let maxRate = 4;
  let percentage = 0;
  if(reviews){
    for(let key in reviews){
      let value = reviews[key];
      if(value){
        ratesCount++;
        rates = rates + (value.rate || 0);
      }
    }
    rate = Math.round(rates/ratesCount);
    return {count: parseInt(ratesCount), rate: rate}
  }
  else{
    return {count: 0, percentage: 0, rate: rate };
  }

}