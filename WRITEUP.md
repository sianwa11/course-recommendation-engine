# Course Recommendation Engine

## 1. Approach & tradeoffs

Each course starts with a score of **0**. Before any scoring happens, I first filter out courses that shouldn't be recommended, such as ones the user has already completed or courses where the user hasn't met the prerequisites.

For the remaining courses, points are added based on different signals. For example, a course gets points if it matches the user's survey responses, is appropriate for their experience level, or aligns with their previous learning activity. Every time a course earns points, I also record the reason for those points. This means the score and the explanation are generated together, so there's no risk of the recommendation saying one thing while the scoring logic does something different.

I chose this rule-based approach because one of the main requirements of the assignment was explainability. While approaches like embeddings or machine learning models can produce good recommendations, they're much harder to explain. A simple scoring system makes it easy to see exactly why a course was recommended and also makes the logic easier to debug and adjust.

To keep the solution simple, I manually chose the point values instead of trying to learn them from data. The scores aren't meant to be absolute, they're only used to rank courses for a single user. I also didn't try to diversify the recommendations, so it's possible for the top recommendations to all be from the same topic if that's what the user is most interested in. Finally, I only use the user's latest survey response and don't consider when it was submitted.

## 2. Signal Weighting

| Source  | Rule                               |                      Points |
| ------- | ---------------------------------- | --------------------------: |
| Survey  | Topic matches preferred topic      |                         +40 |
| Survey  | Skill gap matches course skills    |                         +30 |
| Survey  | Learning goal matches course topic |                         +10 |
| Profile | Course level matches seniority     |                         +20 |
| Usage   | Previously started course          | +10 (+15 if progress > 60%) |
| Usage   | Previously dropped course          |                         −20 |

I gave the highest weight to survey responses because they represent what the user has explicitly said they want to learn. Profile information helps ensure the recommendations are appropriate for the user's experience level, while usage history fine-tunes the results by rewarding continued learning and discouraging courses the user has already abandoned.

The current weights are fixed and were chosen manually based on what felt reasonable. In a production system, I would tune these using real user engagement data. As more usage history becomes available, I'd also gradually give more weight to behavioural signals and less to the initial survey responses, since observed behaviour is usually a better indicator of user interests than stated preferences.

## 3. Cold-start

For new users with no learning history, the recommendation engine naturally falls back to using their survey responses and profile information. Since there are no usage events yet, the usage-related rules simply don't contribute to the score, so no special handling is required.

The main limitation is that recommendations depend entirely on the quality of the onboarding information. If a user has no survey responses either, there isn't enough information to personalise recommendations, so the results become fairly generic. In a production system, I would add fallback strategies such as recommending popular courses within the user's role or industry, and gradually increase the influence of behavioural signals as more usage data is collected.

## 4. Measuring Success

**Hypothesis:** Users shown personalised recommendations will complete more courses than users shown a simple baseline (e.g. most popular courses).

**Metric:** Course completion rate within 30 days, with drop rate tracked as a secondary metric.

**Experiment:** Run an A/B test where one group receives personalised recommendations and the other receives the baseline. After 2–4 weeks, compare completion and drop rates to determine whether the recommendation engine improves learning outcomes.

## 5. Scaling to 10k+ Users

The biggest challenge at scale would be reducing unnecessary database queries rather than changing the scoring logic itself. The current implementation can be improved by batching course-related queries instead of fetching data for each course individually.

From there, I'd pre-filter relevant courses before scoring, cache or precompute recommendations for active users, and add database indexes to speed up lookups. These changes would reduce request latency while keeping the recommendation logic largely unchanged.
