function generatePropertyCode() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const prefix =
        letters[Math.floor(Math.random() * letters.length)] +
        letters[Math.floor(Math.random() * letters.length)] +
        letters[Math.floor(Math.random() * letters.length)];

    const number = Math.floor(
        100000 + Math.random() * 900000
    );

    return `${prefix}-${number}`;
}

module.exports = generatePropertyCode;