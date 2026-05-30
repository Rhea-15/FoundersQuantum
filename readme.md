# FoundersQuantum

Find startup opportunities hidden inside academic research papers.

FoundersQuantum helps founders, investors, and researchers discover commercial opportunities before they become obvious. The platform analyzes recent academic papers, compares them against existing products and open-source projects, and identifies high-potential market gaps in under two minutes.

## What It Does

Users enter a research domain such as "CRISPR diagnostics" or "LLM memory retrieval".

The platform:

* Fetches recent papers from PubMed, arXiv, and OpenAlex
* Collects commercial signals from Product Hunt, AlternativeTo, and GitHub
* Uses Groq (LLaMA 3.3 70B) to compare research capabilities against existing market solutions
* Identifies unmet opportunities and scores them using:

  * Gap Score
  * Novelty Score
  * Market Readiness Score
* Generates a startup brief including:

  * Problem statement
  * Product ideas
  * Target users
  * Monetization strategy
  * Why-now analysis

## How Anakin Wire Is Used

Anakin Wire is the core commercial-intelligence layer of the project.

It is used to scrape:

* Product Hunt search results
* AlternativeTo alternatives and competitors

Workflow:

1. Submit a scrape job using `POST /v1/url-scraper`
2. Receive a `jobId`
3. Poll `GET /v1/url-scraper/{jobId}`
4. Parse the returned markdown
5. Extract competitor and product information

This competitor data is compared against academic research to identify commercialization gaps.

## Tech Stack

Frontend:

* React
* Vite
* Recharts

Backend:

* Node.js
* Express
* Groq (LLaMA 3.3 70B)
* SQLite (better-sqlite3)
* Anakin Wire
* GitHub Search API
* PubMed API
* arXiv API
* OpenAlex API

## Architecture

User Query
↓
Research Collection
(PubMed + arXiv + OpenAlex)
↓
Commercial Signal Collection
(GitHub + Product Hunt + AlternativeTo via Anakin Wire)
↓
AI Analysis Pipeline
↓
Opportunity Scoring
↓
Startup Brief Generation
↓
Results Dashboard

## Technical Challenges Solved

* Migrated from deprecated Gemini 1.5 Flash to Groq LLaMA 3.3 70B
* Fixed SQLite foreign key failures caused by incorrect insertion order
* Implemented Anakin Wire's asynchronous URL Scraper workflow
* Corrected GitHub API authentication to restore full rate limits
* Replaced Product Hunt GraphQL integration with Anakin Wire scraping

## Impact

Most research breakthroughs never become products.

FoundersQuantum reduces the time required to discover research-backed startup opportunities from weeks of manual analysis to under two minutes.

Target users:

* Early-stage founders
* VC analysts
* Innovation teams
* Academic researchers

## Deployment

Frontend: Render

Backend: Render

## Hackathon Alignment

Idea:
Transforms academic research into actionable startup opportunities.

Execution:
Full-stack application using live academic and commercial data sources.

Anakin Wire Usage:
Uses the URL Scraper API to collect Product Hunt and AlternativeTo competitor intelligence.

Real-World Impact:
Helps founders discover defensible startup ideas before markets become crowded.

Built for the Anakin Wire Hackathon 2026.
