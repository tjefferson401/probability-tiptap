export const createPosition = () => {
    const position = new Array(3).fill('').map(x => new Array(8).fill(''));
    position[2][3] = 'rp'
    position[0][3] = 'bp'

    return position;
}

export const copyPosition = position => {
    const newPosition = new Array(3).fill('').map(x => new Array(8).fill(''));

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            newPosition[row][col] = position[row][col]
        }
    }

    return newPosition
}

export const rollDice = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 2));
};

export const getMove = (position, piece, row, col, moveLength) => {
    const coordinateMapRed = {
        '2-3': 0,
        '2-4': 1,
        '2-5': 2,
        '2-6': 3,
        '2-7': 4,
        '1-7': 5,
        '1-6': 6,
        '1-5': 7,
        '1-4': 8,
        '1-3': 9,
        '1-2': 10,
        '1-1': 11,
        '1-0': 12,
        '2-0': 13,
        '2-1': 14,
        '2-2': 15
    }

    const coordinateMapBlue = {
        '0-3': 0,
        '0-4': 1,
        '0-5': 2,
        '0-6': 3,
        '0-7': 4,
        '1-7': 5,
        '1-6': 6,
        '1-5': 7,
        '1-4': 8,
        '1-3': 9,
        '1-2': 10,
        '1-1': 11,
        '1-0': 12,
        '0-0': 13,
        '0-1': 14,
        '0-2': 15
    
    }

    const indexMapRed = {
        0: '2-3',
        1: '2-4',
        2: '2-5',
        3: '2-6',
        4: '2-7',
        5: '1-7',
        6: '1-6',
        7: '1-5',
        8: '1-4',
        9: '1-3',
        10: '1-2',
        11: '1-1',
        12: '1-0',
        13: '2-0',
        14: '2-1',
        15: '2-2'
    }

    const indexMapBlue = {
        0: '0-3',
        1: '0-4',
        2: '0-5',
        3: '0-6',
        4: '0-7',
        5: '1-7',
        6: '1-6',
        7: '1-5',
        8: '1-4',
        9: '1-3',
        10: '1-2',
        11: '1-1',
        12: '1-0',
        13: '0-0',
        14: '0-1',
        15: '0-2'
    }

    const coordString = `${row}-${col}`;

    let move = undefined;

    if (piece[0] === 'r') {
        const index = coordinateMapRed[coordString];
        const newIndex = index + moveLength;
        if (newIndex > 15) {
            return null
        } else {
            move = indexMapRed[newIndex];
        }

    } else {
        const index = coordinateMapBlue[coordString];
        const newIndex = index + moveLength;
        if (newIndex > 15) {
            return null
        } else {
            move = indexMapBlue[newIndex];
        }
        
    }

    const [newRow, newCol] = move.split('-');
    return [parseInt(newRow), parseInt(newCol)];

}

export const normalize = (arr) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    return arr.map(x => x / sum);
}