const calculateTip = (total, tipPercent = .20) =>  total + (total * tipPercent)

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a, b) =>{
    return new Promise((resolve, reject) => {
      setTimeout(() =>{
        if(a < 0 || b < 0){
          return reject('non neg nums only')
        }
        resolve (a + b)
      }, 1000)
    })
  }




module.exports = { 
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}