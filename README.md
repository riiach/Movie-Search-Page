# Movie Search App 🎬

A movie search web app built with **React + Vite**, powered by the **TMDB API**.  
Users can search through thousands of movies, view key details, and track trending searches using **Appwrite**.

This project is originally inspired by a tutorial from **JavaScript Mastery (YouTube)**.  
Through building this app, I learned how to fetch external API data, manage search state efficiently, and optimize search-related interactions.

---

## Live Website

🔗 https://your-live-site-link.com  
*(Replace with your deployed URL)*

---

## Preview

![Movie Search App Preview](./public/preview.png)  
*(Replace with your actual preview image)*

---

## Features

- 🔍 Search movies from the TMDB database
- 🎞️ Display movie details:
  - Poster image
  - Title
  - Rating
  - Original language
  - Release year
- ⭐ Track popular search terms using Appwrite
- 🧠 Optimized search behavior with controlled inputs
- 🖼️ Graceful fallbacks for missing poster, rating, or release date

---

## Tech Stack

- **React**
- **Vite**
- **TMDB API**
- **Appwrite (Cloud Database)**
- **ESLint**

---

## Components Overview

### `Search`
- Controlled input component
- Updates `searchTerm` state as the user types
- Triggers search logic from the parent component

### `MovieCard`
- Displays individual movie data
- Shows:
  - poster image (with fallback)
  - movie title
  - vote average (formatted to 1 decimal)
  - original language
  - release year

### `updateSearchCount`
- Stores search popularity using Appwrite
- Logic:
  1. Check if the search term already exists
  2. If it exists → increment count
  3. If not → create a new document with movie metadata

---

## Appwrite Integration

This project uses **Appwrite Database** to store trending searches.

Each document contains:
- `searchTerm` – searched keyword
- `count` – number of times searched
- `movie_id` – TMDB movie ID
- `poster_url` – movie poster image URL

Search count logic:
- Uses `Query.equal()` to find an existing search term
- Updates the document if found
- Creates a new document if not found

---

## TMDB Image Handling

Movie posters are loaded using TMDB’s image CDN:

- If `poster_path` exists:
