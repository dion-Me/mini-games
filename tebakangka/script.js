let angkaRandom = Math.floor(Math.random() * 100) + 1;
let percobaan = 0;

function cekTebakan() {

    const tebakan = Number(document.getElementById("guess").value);
    const hasil = document.getElementById("hasil");
    const counter = document.getElementById("counter");

    percobaan++;

    counter.textContent = "Attempts: " + percobaan;

    if (tebakan < angkaRandom) {
        hasil.textContent = "Terlalu kecil!";
    }
    else if (tebakan > angkaRandom) {
        hasil.textContent = "Terlalu besar!";
    }
    else {
        hasil.textContent = "Benar! 🎉";
    }

}