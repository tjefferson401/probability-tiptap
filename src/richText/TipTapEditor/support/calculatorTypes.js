import {
    factorial,
    combination,
    phi,
    inversePhi,
    normCDF,
    betaCDF
} from './calculateFunctions'


export const CalcTypes = {
    'factorial': {
        latexTitle: "Factorial n!",
        inputs: [
            {
                label: "n",
                type: "number",
                value: 0
            }
        ],
        functionName: "factorial",
        function: factorial
    },
    "combination": {
        latexTitle: "Combination \\binom{n}{k}",
        inputs: [
            {
                label: "n",
                type: "number",
                value: 0
            },
            {
                label: "k",
                type: "number",
                value: 0
            }
        ],
        functionName: "combination",
        function: combination
    },
    "phi": {
        latexTitle: "Phi \\phi(x)",
        inputs: [
            {
                label: "x",
                type: "number",
                value: 0
            }
        ],
        functionName: "phi",
        function: phi
    },
    "inversePhi": {
        latexTitle: "Inverse Phi \\phi^{-1}(x)",
        inputs: [
            {
                label: "y",
                type: "number",
                value: 0
            }
        ],
        functionName: "inversePhi",
        function: inversePhi
    },
    "normCDF": {
        latexTitle: "NormCDF(x)",
        inputs: [
            {
                label: "x",
                type: "number",
                value: 0
            },
            {
                label: "mu", 
                type: "number",
                value: 0
            },
            {
                label: "std", 
                type: "number",
                value: 0
            }
        ],
        functionName: "norm.cdf",
        function: normCDF
    },
    "betaCDF": {
        latexTitle: "BetaCDF(x)",
        inputs: [
            {
                label: "x",
                type: "number",
                value: 0
            },
            {
                label: "a", 
                type: "number",
                value: 0
            },
            {
                label: "b", 
                type: "number",
                value: 0
            }
        ],
        functionName: "beta.cdf",
        function: betaCDF
    },
}