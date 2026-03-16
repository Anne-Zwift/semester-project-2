/**Renders the main Details Page structure */
// src/pages/LandingPage.ts
export function DetailsPage() {
  const app = document.querySelector('#content-area');
  if (app)
    app.innerHTML =
      "<h1 class='text-3xl font-bold text-blue-600'>Welcome to the Auction!</h1>";
}
