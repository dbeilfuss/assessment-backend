function speciesCalculator(request) {
  return new Promise((resolve, reject) => {
    let requestBody = request;

    let requestURL = `http://localhost:4000/api/matchSpecies/`;

    console.log(requestBody);
    console.log(requestURL);

    axios
      .post(requestURL, requestBody)
      .then((res) => {
        let mostCommonSpecies = "";

        console.log(res);

        // Initialize objects to hold species counts and attribute lists
        const speciesCounts = {};
        const speciesAttributes = {};

        // Iterate over each attribute in the response data
        for (const [attribute, speciesArray] of Object.entries(res.data)) {
          speciesArray.forEach((species) => {
            // Increment species count
            speciesCounts[species] = (speciesCounts[species] || 0) + 1;

            // Add attribute to species' list of attributes
            if (!speciesAttributes[species]) {
              speciesAttributes[species] = [];
            }
            speciesAttributes[species].push(attribute);
          });
        }

        // Find the species with the highest count
        let maxCount = 0;
        for (const [species, count] of Object.entries(speciesCounts)) {
          if (count > maxCount) {
            maxCount = count;
            mostCommonSpecies = species;
          }
        }

        // List of attributes that the most common species did and did not appear in
        const appearedIn = speciesAttributes[mostCommonSpecies] || [];
        const notAppearedIn = Object.keys(res.data).filter(
          (attr) => !appearedIn.includes(attr)
        );

        console.log(`Most common species: ${mostCommonSpecies}`);
        console.log(`Appeared in attributes: ${appearedIn.join(", ")}`);
        console.log(
          `Did not appear in attributes: ${notAppearedIn.join(", ")}`
        );
        const results = {
          species: mostCommonSpecies,
          similarAttributes: appearedIn,
        };
        console.log(results);
        resolve(results);
      })

      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
