    const elokuva = document.querySelector("#elokuvaHaku"); 
    const sarja = document.querySelector("#sarjaHaku"); 
    const nappi = document.querySelector("#nappi")
    const hakuBtn = document.querySelector(".hakuBtn")
    elokuva.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            results = []
            haeElokuva();
        }
    });

    hakuBtn.addEventListener("click", function() {
        results = []
        haeElokuva();
    });

    // Leffa osio
    function haeElokuva() {
        // 
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
                            console.log("Duplikaatti löytyi ei lisätä listaan.")
                        }
                        else {
                            
                            results.push(result.Title)

                            fetch(`https://www.omdbapi.com/?t=${result.Title}&apikey=54405f3f`)
                            .then(response => response.json())
                            .then(new_data => {
                                hakuteksti = document.querySelector("#hakuteksti")
                                hakuteksti.style.display = "block"

                                tulokset = document.querySelector(".tulokset")
                                otsikko = document.createElement("h4")
                                otsikko.textContent = `${new_data.Title} (${new_data.Year})`
                                arvostelijat = document.querySelector("#arvostelijat")
            
                                poster = document.createElement("img")
                                poster.src = new_data.Poster


            
                                //arvostelu.textContent = `${new_data}`
                                buttoni = document.createElement("button")
                                
                                buttoni.textContent = "Lisätietoja";
                                buttoni.addEventListener("click", function() {
                                    ElokuvanTiedot(new_data);
                                });
                                tuloksetTeksti = document.createElement("h5")
                                if (arvostelijat.value === "RT") {
                                    arvostelija = "Rotten Tomatoes"
                                    new_data.Ratings.forEach(rating => {
                                    if (rating.Source === "Rotten Tomatoes")
                                    { 
                                        tuloksetTeksti.textContent = `${arvostelija}: ${rating.Value}`
                                    }
                                });

                                }
                                else if (arvostelijat.value === "IMDB") {
                                    arvostelija = "IMDB"
                                    new_data.Ratings.forEach(rating => {
                                    if (rating.Source === "Internet Movie Database")
                                    { 
                                        tuloksetTeksti.textContent = `${arvostelija}: ${rating.Value}`
                                    }
                                
                                });

                                        
                                }
                                else if (arvostelijat.value === "MC") {
                                    arvostelija = "Metacritic"
                                    new_data.Ratings.forEach(rating => {
                                        if (rating.Source === "Metacritic")
                                        { 
                                            tuloksetTeksti.textContent = `${arvostelija}: ${rating.Value}`
                                        }
                                    
                                });
                                }

                                tulokset.appendChild(otsikko)
                                tulokset.appendChild(poster) 
                                tulokset.appendChild(tuloksetTeksti)
                                tulokset.appendChild(buttoni)


                        })
                        .catch(error => console.error('Virhe:', error));
                    }
                    }
                });
                }

            )
            .catch(error => console.error('Virhe:', error));
        }

    // Valitun leffan tiedot ja piilottaa hakukentän ja haetut leffat jne...

    function ElokuvanTiedot(elokuvadata) {
        const suodataOsio = document.querySelector("#suodata");
        const tulokset = document.querySelector(".tulokset");

        if (suodataOsio) suodataOsio.style.display = "none";
        if (tulokset) tulokset.style.display = "none";

        let detailContainer = document.querySelector(".detail-container");
        if (!detailContainer) {
            detailContainer = document.createElement("div");
            detailContainer.className = "detail-container";

            const tuloksetDiv = document.querySelector("#tulos");
            tuloksetDiv.parentNode.insertBefore(detailContainer, tuloksetDiv.nextSibling);
        }

        // Leffan tiedot

        detailContainer.innerHTML = `
        <button id="takaisin"> ← takaisin hakuun </button>
        <div class="elokuvan-tiedot">
            <div class="elokuvan-poster">
                <img src="${elokuvadata.Poster}" alt="${elokuvadata.Title}">
            </div> 
            <div class="leffaInfo">
                <h2>${elokuvadata.Title} (${elokuvadata.Year})</h2>
                <p><strong>Pituus:</strong> ${elokuvadata.Runtime}</p>
                <p><strong>Genre:</strong> ${elokuvadata.Genre}</p>
                <p><strong>Ohjaaja:</strong> ${elokuvadata.Director}</p>
                <p><strong>Kuvaus:</strong> ${elokuvadata.Plot}</p>


            
            ${elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Internet Movie Database") 
                ? `<p><strong>IMDB:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Internet Movie Database").Value}</p>` 
                : ''}
            
            ${elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Rotten Tomatoes") 
                ? `<p><strong>Rotten Tomatoes:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Rotten Tomatoes").Value}</p>` 
                : ''}
            
            ${elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Metacritic") 
                ? `<p><strong>Metacritic:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Metacritic").Value}</p>` 
                : ''}
            
            <p><strong>Kieli:</strong> ${elokuvadata.Language}</p>
            <p><strong>Maa:</strong> ${elokuvadata.Country}</p>
        </div>
            </div>    
        `;
        
        detailContainer.style.display = "block";

        document.getElementById("takaisin").addEventListener("click", function() {
        // Näyttää hakuosion ja tulokset uudelleen
        if (suodataOsio) suodataOsio.style.display = "block";
        if (tulokset) tulokset.style.display = "block";
        
        // Piilottaa detail-containerin
        detailContainer.style.display = "none";
});

}

    // Sarja osio
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




