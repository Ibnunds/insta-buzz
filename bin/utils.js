function pickRandomElement(arr) {
  // Memastikan array tidak kosong
  if (arr.length === 0) {
    return null;
  }

  // Menghasilkan indeks acak
  const randomIndex = Math.floor(Math.random() * arr.length);

  // Mengambil elemen dengan indeks acak
  const randomElement = arr[randomIndex];

  return randomElement;
}

module.exports = {
  pickRandomElement,
};
