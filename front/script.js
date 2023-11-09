// Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const keywordInput = document.getElementById("keyword");
  const scrapeBtn = document.getElementById("scrapeBtn");
  const resultsDiv = document.getElementById("results");
  const delayBetweenRequests = 5000; // Delay between requests in milliseconds

  // Add a click event listener to the "Scrape" button
  scrapeBtn.addEventListener("click", async () => {
    // Get the search keyword from the input field
    const keyword = keywordInput.value;

    // Check if the keyword input is empty and show an alert if it is
    if (!keyword) {
      alert("Please enter a keyword");
      return;
    }

    try {
      // Send a fetch request to the API with the entered keyword
      const response = await fetch(
        `http://localhost:3000/api/scrape?keyword=${keyword}`
        // `https://fantastic-capybara-gj575xjx4r4hpv7j-3000.app.github.dev/api/scrape?keyword=${keyword}`
      );

      // Check if the response status is OK, or else throw an error
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log(data);

      // Check if the data is an array and contains at least one item
      if (Array.isArray(data) && data.length > 0) {
        // Display the results on the page
        displayResults(data);
      } else {
        resultsDiv.innerHTML = "No products found.";
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      resultsDiv.innerHTML = "Failed to fetch data.";
    }
  });

  // Function to display the results on the page
  function displayResults(data) {
    resultsDiv.innerHTML = "";

    data.forEach((product) => {
      if (product && product.title) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const title = document.createElement("h2");
        title.textContent = product.title || "N/A";
        title.classList.add("product-title");

        const rating = document.createElement("p");
        rating.textContent = `Rating: ${product.rating || "N/A"}`;
        rating.classList.add("product-sub");

        const numReviews = document.createElement("p");
        numReviews.textContent = `Reviews: ${product.numReviews || "N/A"}`;
        numReviews.classList.add("product-sub");

        const img = document.createElement("img");
        img.src = product.imgURL;
        img.alt = product.title;
        img.classList.add("product-img");

        productDiv.appendChild(img);
        productDiv.appendChild(title);
        productDiv.appendChild(rating);
        productDiv.appendChild(numReviews);

        resultsDiv.appendChild(productDiv);
      }
    });
  }

  // Set a timeout to prevent rapid consecutive requests
  setTimeout(() => {
    isRequestPending = false;
  }, delayBetweenRequests);
});
