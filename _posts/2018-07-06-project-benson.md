---
layout: post
title: Harnessing Marketing Power of Street Teams Leveraging Data Science
---

### Problem Statement
WomenTechWomenYes (WTWY) holds an annual gala every summer. For this year, they planned to place marketing street teams at various NY MTA stations to generate buzz and raise awareness.

However, the organization is constrained by following factors:
<ul>
<li>Time constraint. Short timeline prior to the event </li>
<li>Funding constraint</li>
<li>Labor constraint. Limited number of teams available. </li>
</ul>


### Goals
Optimizing the placement of Marketing team and maximizing the effectiveness of the campaign are critical. Following goals should be achieved:
<ul>

<li>Raise fund</li>
<li>Raise brand awareness and reach</li>
<li>Increase the participation of women in technology </li>
</ul>


### Analysis
After thorough analysis, we believed following factors have strong impact to the street team marketing effectiveness:

<ol>
<li>Traffic around each station - leveraging MTA traffic data</li>
<li> How far each station is from surrounding top 20 high Tech firms in NY - leveraging Google Maps API</li>
<li>How far each station is from surrounding Starbucks - leveraging Google Maps API </li>
<li> Female relative percentage at each station- leveraging US Census data</li>
</ol>

Promixity score were derived for each of four factors for each station. Weights were assigned to each of the factor above to reach a final score for final ranking purpose.

### Results

Stations were ranked based on the weighted average score of above four factors. Top 10 stations and optimal time windows were identified


### Conclusion and Next Steps

Recommended top stations and time window to place the street time to maximize marketing impact
<ul>
<li>Time Square, E14th Street, Herald Square Stations were identified as top 3 stations</li>
<li>Friday to Saturday 7 p.m.-9 p.m. were identified as best time window to maximize results</li>
</ul>
Next steps:
<ul>
<li>Tourist vs. Resident impact and short term vs. long term impact</li>
<li>Other factors can consider: education and income level</li>
</ul>




### Recommendations
