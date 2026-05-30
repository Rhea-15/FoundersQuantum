export const SUMMARIZE_PAPER = (title, abstract) => `
You are a research analyst. Summarize this academic paper in exactly 2 sentences.
Sentence 1: What was studied and what method was used.
Sentence 2: The key finding and its practical implication.

Use plain English. No jargon. No hedging phrases like "the authors claim".

Paper Title: ${title}
Abstract: ${abstract}

Respond with only the 2-sentence summary. No preamble.
`.trim()

export const SCORE_NOVELTY = (paper_summary, competing_products) => `
You are a technology scout evaluating research novelty and commercial whitespace.

Paper Summary: ${paper_summary}

Known commercial products/tools in this space:
${competing_products.length > 0
  ? competing_products.map(p => `- ${p}`).join('\n')
  : '- None found'}

Score the following on a scale of 1.0-10.0 (one decimal):
- novelty_score: How technically novel is this research vs. existing products? (10 = nothing like it exists)
- gap_score: How large is the commercial gap? (10 = no product addresses this need at all)
- market_readiness_score: How close is this to being buildable as a product today? (10 = could ship in 6 months)

Respond ONLY with valid JSON. No explanation outside the JSON.

{
  "novelty_score": 0.0,
  "gap_score": 0.0,
  "market_readiness_score": 0.0,
  "reasoning": "2 sentences explaining the gap score"
}
`.trim()

export const ANALYZE_MARKET_GAP = (paper_summary, gap_score, competing_products) => `
You are a startup market analyst. Analyze the commercial gap for this research.

Research Summary: ${paper_summary}
Gap Score: ${gap_score}/10
Existing Competition: ${competing_products.join(', ') || 'None'}

Identify:
1. Why this gap exists (technical barrier? awareness? market timing?)
2. Who is currently underserved
3. What category of product would close this gap (SaaS / hardware / API / marketplace / platform)

Respond ONLY with valid JSON:
{
  "gap_reason": "1 sentence",
  "underserved_segment": "specific user group",
  "product_category": "SaaS",
  "time_to_market_estimate": "6-12 months",
  "primary_risk": "biggest risk for a startup in this space"
}
`.trim()

export const GENERATE_OPPORTUNITY = (paper_summary, market_gap, scores) => `
You are a product strategist and startup advisor. Generate a concrete startup opportunity from this research gap.

Research Summary: ${paper_summary}
Gap Score: ${scores.gap_score}/10
Underserved Segment: ${market_gap.underserved_segment}
Product Category: ${market_gap.product_category}
Gap Reason: ${market_gap.gap_reason}

Generate a startup opportunity brief. Respond ONLY with valid JSON:

{
  "opportunity_title": "punchy 5-8 word title, no buzzwords",
  "problem_statement": "2-3 sentences: the real-world pain this creates",
  "product_angles": [
    "specific product idea 1 — include who pays and how",
    "specific product idea 2 — different angle or market",
    "specific product idea 3 — most ambitious version"
  ],
  "target_user": "primary user persona, specific",
  "monetization": "specific model: subscription $X/mo or usage-based $X/call or one-time or hardware + SaaS",
  "unfair_advantage": "why building this now, post this research, is advantageous"
}
`.trim()

export const VALIDATE_QUERY = (query) => `
You are helping a user search for academic research gaps to build products from.

User query: "${query}"

Evaluate this query:
1. Is it specific enough to return relevant research? (too broad = "AI", good = "LLM memory retrieval")
2. Does it describe a real research domain?

Respond ONLY with valid JSON:
{
  "is_valid": true,
  "is_too_broad": false,
  "suggestions": ["more specific version 1", "more specific version 2", "more specific version 3"],
  "normalized_query": "cleaned up version of the query for API calls"
}
`.trim()