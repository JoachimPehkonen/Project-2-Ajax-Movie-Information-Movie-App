    const elokuva = document.querySelector("#elokuvaHaku"); 
    const sarja = document.querySelector("#sarjaHaku"); 
    const nappi = document.querySelector("#nappi")
    const hakuBtn = document.querySelector(".hakuBtn")
    
    // Leffaosion haku
    elokuva.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            results = []
            tyhjennaTulokset();
            haeElokuva();
        }
    });

    hakuBtn.addEventListener("click", function() {
        results = []
        tyhjennaTulokset();
        haeElokuva();
    });

    // Tyhjentää aiemmat hakutulokset, jotta hakutulokset kohta olisi selkeämpi :)

    function tyhjennaTulokset() {
        const tulokset = document.querySelector(".tulokset");
        const hakuteksti = document.querySelector("#hakuteksti");

        // Pyyhkii vanhan hakutuloksen ja lisää uuden tilalle

        if (tulokset) {
            tulokset.innerHTML = '';
            if (hakuteksti) {
                tulokset.appendChild(hakuteksti);

            }
        }
    }

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
        const arvostelijat = document.querySelector("#arvostelijat");

        if (suodataOsio) suodataOsio.style.display = "none";
        if (tulokset) tulokset.style.display = "none";

        let detailContainer = document.querySelector(".detail-container");
        if (!detailContainer) {
            detailContainer = document.createElement("div");
            detailContainer.className = "detail-container";

            const tuloksetDiv = document.querySelector("#tulos");
            tuloksetDiv.parentNode.insertBefore(detailContainer, tuloksetDiv.nextSibling);
        }

        // Mikä arvostelija näkyy, kun se valitaan suodattimesta.
        
        let showIMDB = false;
        let showRT = false;
        let showMC = false;

        if (arvostelijat.value === "IMDB") {
            showIMDB = true;
        } else if (arvostelijat.value === "RT") {
            showRT = true;
        } else if (arvostelijat.value === "MC") {
            showMC = true;
        
        }

        // Leffan tiedot  
        
        detailContainer.innerHTML = `
        <div class="elokuvan-tiedot">
            <div class="elokuvan-poster">
                <img class="posteri" src="${elokuvadata.Poster}" alt="${elokuvadata.Title}">
            </div> 
            <div class="leffaInfo">
                <p><strong>Pituus:</strong> ${elokuvadata.Runtime}</p>
                <p><strong>Genre:</strong> ${elokuvadata.Genre}</p>
                <p><strong>Ohjaaja:</strong> ${elokuvadata.Director}</p>
                <p><strong>Maa:</strong> ${elokuvadata.Country}</p>
                <p><strong>Kieli:</strong> ${elokuvadata.Language}</p>
                <p><strong>Palkinnot:</strong> ${elokuvadata.Awards}</p>
                <p><strong>Box Office:</strong> ${elokuvadata.BoxOffice}</p>
                <p class="kuvaus"><strong>Kuvaus:</strong> ${elokuvadata.Plot}</p>
             ${showIMDB && elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Internet Movie Database") 
                ? `<p><strong>IMDB:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Internet Movie Database").Value}</p>` 
                : ''}
            
            ${showRT && elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Rotten Tomatoes") 
                ? `<p><strong>Rotten Tomatoes:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Rotten Tomatoes").Value}</p>` 
                : ''}
            
            ${showMC && elokuvadata.Ratings && elokuvadata.Ratings.find(r => r.Source === "Metacritic") 
                ? `<p><strong>Metacritic:</strong> ${elokuvadata.Ratings.find(r => r.Source === "Metacritic").Value}</p>` 
                : ''}
            </div>
        </div>
        <h2>${elokuvadata.Title} (${elokuvadata.Year})</h2>
        <button class="buttoni" id="takaisin"> ← takaisin hakuun </button>
            <style>
                * {
                font-family: Arial;
                }
                p{
                color: white;
                }
                h2 {
                color: white;
                margin-left: 120px;
                margin-bottom: 30px;
                }
                .elokuvan-tiedot {
                display: flex;
                margin: 0px;

                margin-top: 30px;
                padding: 0px 50px;
                
                }
                .elokuvan-poster {
                    margin-right: 30px;
                }
                
                .leffaInfo {
                    flex-grow: 1;
                }
                .buttoni {
                color: white;
                background-color: green;
                border: none;
                font-weight: bold;
                padding: 10px 20px;
                border-radius: 10px;
                margin-bottom: 40px;
                margin-top: 20x;
                margin-left: 50px;
                }
                
                .posteri {
                border-radius: 40px;
                border: solid 1px gray;
                }
                
                
                .kuvaus {
                width: 500px;
                }
            </style>
            
            
            
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

    // Sarja hakuosio
    sarja.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            results = [];
            tyhjennaTulokset();
            haeSarja();
        }
    });

    const sarjaHakuBtn = document.querySelector("#ohjelma .hakuBtn"); // Valitsee sarjaosion hakunapin

    sarjaHakuBtn.addEventListener("click", function() {
        results = [];
        tyhjennaTulokset();
        haeSarja();
    });

    // Sarja osio
    function haeSarja() {
        // 
            // Haetaan inputtiin syötetyt arvot ja palautetaan kaikki löydetyt haut.
            fetch(`https://www.omdbapi.com/?s=${sarja.value}&apikey=54405f3f`)
            // Palautetaan data JSON muotoon ellei ole jo
            .then(response => response.json())
            // Sitten määritellään mitä tehdään datalla.
            .then(data => {
                // data = kaikki tulokset json muodossa. Käydään läpi yksitellen tulokset.
                data.Search.forEach(result => {

                    if (result.Type === "series") {
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
                                arvostelijat = document.querySelector("#sarjaArvostelijat")
            
                                poster = document.createElement("img")
                                poster.src = new_data.Poster


            
                                //arvostelu.textContent = `${new_data}`
                                buttoni = document.createElement("button")
                                
                                buttoni.textContent = "Lisätietoja";
                                buttoni.addEventListener("click", function() {
                                    SarjanTiedot(new_data);
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

    // Valitun sarjan tiedot ja piilottaa hakukentän ja haetut leffat jne...

   function SarjanTiedot(sarjadata) {
    const suodataOsio = document.querySelector("#suodata");
    const tulokset = document.querySelector(".tulokset");
    const arvostelijat = document.querySelector("#sarjaArvostelijat");

    if (suodataOsio) suodataOsio.style.display = "none";
    if (tulokset) tulokset.style.display = "none";

    let detailContainer = document.querySelector(".detail-container");
    if (!detailContainer) {
        detailContainer = document.createElement("div");
        detailContainer.className = "detail-container";

        const tuloksetDiv = document.querySelector("#tulos");
        tuloksetDiv.parentNode.insertBefore(detailContainer, tuloksetDiv.nextSibling);
    }

    // Mikä arvostelija näkyy, kun se valitaan suodattimesta.
    
    let showIMDB = false;
    let showRT = false;
    let showMC = false;

    if (arvostelijat.value === "IMDB") {
        showIMDB = true;
    } else if (arvostelijat.value === "RT") {
        showRT = true;
    } else if (arvostelijat.value === "MC") {
        showMC = true;
    
    }

    // Sarja tiedot
    
    detailContainer.innerHTML = `
    <div class="sarjan-tiedot">
        <div class="sarjan-poster">
            <img class="posteri" src="${sarjadata.Poster}" alt="${sarjadata.Title}">
        </div> 
        <div class="sarjaInfo">
            <p><strong>Pituus:</strong> ${sarjadata.Runtime}</p>
            <p><strong>Genre:</strong> ${sarjadata.Genre}</p>
            <p><strong>Ohjaaja:</strong> ${sarjadata.Director}</p>
            <p><strong>Maa:</strong> ${sarjadata.Country}</p>
            <p><strong>Kieli:</strong> ${sarjadata.Language}</p>
            <p><strong>Palkinnot:</strong> ${sarjadata.Awards}</p>
            <p><strong>Box Office:</strong> ${sarjadata.BoxOffice}</p>
            <p class="kuvaus"><strong>Kuvaus:</strong> ${sarjadata.Plot}</p>
              ${showIMDB && sarjadata.Ratings && sarjadata.Ratings.find(r => r.Source === "Internet Movie Database") 
            ? `<p><strong>IMDB:</strong> ${sarjadata.Ratings.find(r => r.Source === "Internet Movie Database").Value}</p>` 
            : ''}
        
        ${showRT && sarjadata.Ratings && sarjadata.Ratings.find(r => r.Source === "Rotten Tomatoes") 
            ? `<p><strong>Rotten Tomatoes:</strong> ${sarjadata.Ratings.find(r => r.Source === "Rotten Tomatoes").Value}</p>` 
            : ''}
        
        ${showMC && sarjadata.Ratings && sarjadata.Ratings.find(r => r.Source === "Metacritic") 
            ? `<p><strong>Metacritic:</strong> ${sarjadata.Ratings.find(r => r.Source === "Metacritic").Value}</p>` 
            : ''}
        </div>
    </div>
    <h2>${sarjadata.Title} (${sarjadata.Year})</h2>
    <button class="buttoni" id="takaisin"> ← takaisin hakuun </button>
        <style>
            * {
            font-family: Arial;
            }
            p {
            color: white;
            }
            h2 {
            color: white;
            margin-left: 120px;
            margin-bottom: 30px;
            }
            .sarjan-tiedot {
            display: flex;
            margin: 0px;

            margin-top: 30px;
            padding: 0px 50px;
            
            }
            .sarjan-poster {
                margin-right: 30px;
            }
            
            .sarjaInfo {
                flex-grow: 1;
            }
            .buttoni {
            color: white;
            background-color: green;
            border: none;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 10px;
            margin-bottom: 40px;
            margin-top: 20x;
            margin-left: 50px;
            }
            
            .posteri {
            border-radius: 40px;
            border: solid 1px gray;
            }
            
            
            .kuvaus {
            width: 500px;
            }
        </style>
        
        
        
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