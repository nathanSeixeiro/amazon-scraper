document.addEventListener("DOMContentLoaded", function () {
  const keywordInput = document.getElementById("keyword");
  const scrapeBtn = document.getElementById("scrapeBtn");
  const resultsDiv = document.getElementById("results");
  const delayBetweenRequests = 5000; 
  
  scrapeBtn.addEventListener("click", async () => {
    const keyword = keywordInput.value;

    if (!keyword) {
      alert("Please enter a keyword");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/scrape?keyword=${keyword}`
      );
      const data = await response.json();
      console.log(data);
      displayResults(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      resultsDiv.innerHTML = "Failed to fetch data.";
    }
  });

  function displayResults(data) {
    resultsDiv.innerHTML = "";

    if (data.length === 0) {
      resultsDiv.innerHTML = "No products found.";
      return;
    }

    const products = excludeEmptyItems(data);
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";

      const title = document.createElement("h2");
      title.textContent = product.title;

      const rating = document.createElement("p");
      rating.textContent = `Rating: ${product.rating || "N/A"}`;

      const numReviews = document.createElement("p");
      numReviews.textContent = `Reviews: ${product.numReviews || "N/A"}`;

      const img = document.createElement("img");
      img.src = product.imgURL;
      img.alt = product.title;

      productDiv.appendChild(img);
      productDiv.appendChild(title);
      productDiv.appendChild(rating);
      productDiv.appendChild(numReviews);

      resultsDiv.appendChild(productDiv);
    });

    function excludeEmptyItems(products) {
      products = products.filter((product) => product.title !== "");
      return;
    }

    setTimeout(() => {
      isRequestPending = false;
    }, delayBetweenRequests);
  }
});
