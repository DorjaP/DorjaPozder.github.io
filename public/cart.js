window.addEventListener('DOMContentLoaded', () => {
    osvjeziKosaricu();
    document.getElementById('potvrdi-kosaricu').addEventListener('click', potvrdiKosaricu);
});

function osvjeziKosaricu() {
    const lista = document.getElementById('lista-kosarice');
    const kosarica = JSON.parse(localStorage.getItem('kosarica')) || [];
    lista.innerHTML = '';
    if (kosarica.length === 0) {
        lista.innerHTML = '<li>Košarica je prazna.</li>';
        return;
    }
    kosarica.forEach((day, index) => {
        const li = document.createElement('li');
        li.textContent = `${day.temperature}°C, ${day.weatherType}, ${day.location} (${day.season})`;
        const ukloniBtn = document.createElement('button');
        ukloniBtn.textContent = 'Ukloni';
        ukloniBtn.addEventListener('click', () => {
            ukloniIzKosarice(index);
        });
        li.appendChild(ukloniBtn);
        lista.appendChild(li);
    });
}

function ukloniIzKosarice(index) {
    let kosarica = JSON.parse(localStorage.getItem('kosarica')) || [];
    kosarica.splice(index, 1);
    localStorage.setItem('kosarica', JSON.stringify(kosarica));
    osvjeziKosaricu();
}

function potvrdiKosaricu() {
    const kosarica = JSON.parse(localStorage.getItem('kosarica')) || [];
    if (kosarica.length === 0) {
        alert('Košarica je prazna!');
    } else {
        alert(`Uspješno ste isplanirali ${kosarica.length} dana za svoje aktivnosti na otvorenom!`);
        localStorage.setItem('kosarica', JSON.stringify([]));
        osvjeziKosaricu();
    }
}