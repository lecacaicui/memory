async function chargerBrawlers() {
    const reponse = await fetch(apiURL);

    if (!reponse.ok) {
        throw new Error(`Erreur HTTP ${reponse.status}`);
    }

    const data = await reponse.json();

    const suspects = data.list.filter(b => b.id === 16000033 || b.id === 16000055);
    console.log(suspects);

    return data.list
        .filter(b => b.imageUrl2 && b.rarity && b.class)
        .map(brawler => ({
            id: brawler.id,
            nom: brawler.name,
            image: brawler.imageUrl2,
            rareteNom: brawler.rarity.name,
            rareteCouleur: brawler.rarity.color,
            description: brawler.description,
            classe: brawler.class.name
        }));
}

chargerBrawlers().then(() => {
    console.log(brawlList);
});