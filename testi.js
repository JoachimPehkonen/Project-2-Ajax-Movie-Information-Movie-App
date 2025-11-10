const elokuva = document.querySelector("#elokuvaHaku"); 
const sarja = document.querySelector("#sarjaHaku"); 
const nappi = document.querySelector("#nappi");
const etsi = document.querySelector("#etsi");


elokuva.addEventListener("keydown", function(event){
    // 
    if (event.key === "Enter") { 
        event.preventDefault();

        // Nollataan lista uutta hakua varten, jotta vanhat otsikot eivät jää listaan
        results = []; 
        // Haetaan inputtiin syötetyt arvot ja palautetaan kaikki löydetyt haut.
        fetch(`https://www.omdbapi.com/?s=${elokuva.value}&apikey=54405f3f`)
        // Palautetaan data JSON muotoon ellei ole jo
        .then(response => response.json())
        // Sitten määritellään mitä tehdään datalla.
        .then(data => {
            // data = kaikki tulokset json muodossa. Käydään läpi yksitellen tulokset.

            data.Search.forEach(result => {

                 if (result.Type === "movie") {
                    if (results.includes(result.Title)) {
                        console.log("Otsikko on jo listalla")
                    }
                    else {
                        results.push(result.Title)
                    
                    fetch(`https://www.omdbapi.com/?t=${results}&apikey=54405f3f`)
                    .then(response => response.json())
                    .then(new_data => {
                        console.log(new_data.Title)
                    })
                    .catch(error => console.error('Virhe:', error));
                    }
                 }
            });
            }

        )
        .catch(error => console.error('Virhe:', error));
    }
});

sarja.addEventListener("keydown", function(event){
    if (event.key === "Enter") { 
        event.preventDefault();
        fetch(`https://www.omdbapi.com/?s=${sarja.value}&apikey=54405f3f`)
        .then(response => response.json())
        .then(data => {
            data.Search.forEach(result => {
                 if (result.Type === "series") {
                    fetch(`https://www.omdbapi.com/?t=${result.Title}&apikey=54405f3f`)
                    .then(response => response.json())
                    .then(new_data => {
                       console.log(new_data)
                    })
                    .catch(error => console.error('Virhe:', error));
                 }
            });
            }

        )
        .catch(error => console.error('Virhe:', error));
    }
});

