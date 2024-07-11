

export const factorial = (n) => {
    if(n == 0) {
        return 1
    }
    return n * factorial(n-1)
}

export const combination = (n,k) => {
    return factorial(n) / (factorial(k) * factorial(n-k))
}

export const phi = (x) => {
    return (1 + Math.erf(x / Math.sqrt(2))) / 2
}

export const inversePhi = (y) => {
    return Math.sqrt(2) * Math.erfInv(2 * y - 1)
}

export const normCDF = (x) => {
    return (1 + Math.erf(x / Math.sqrt(2))) / 2
}

export const betaCDF = (x,a,b) => {
    return math.beta.cdf(x,a,b)
}