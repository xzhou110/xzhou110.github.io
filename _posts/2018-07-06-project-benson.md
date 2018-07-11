---
layout: post
title: Harnessing Marketing Power of Street Teams Leveraging Data Science
---

## Problem Statement

WomenTechWomenYes (WTWY) holds an annual gala every summer. For this year, they planned to place marketing street teams at various NY MTA stations to generate buzz and raise awareness.

However, the organization is constrained by following factors:
<ul>
<li>Time constraint. Short timeline prior to the event </li>
<li>Funding constraint</li>
<li>Labor constraint. Limited number of teams available. </li>
</ul>


## Goals

Optimizing the placement of Marketing team and maximizing the effectiveness of the campaign are critical. Following goals should be achieved:
<ul>

<li>Raise fund</li>
<li>Raise brand awareness and reach</li>
<li>Increase the participation of women in technology </li>
</ul>


### Analysis

After thorough analysis, we believed following aspects have strong impact to the street team marketing effectiveness:

<ul>
<li>Traffic around each station - leveraging MTA traffic data</li>
<li> How far each station is from surrounding top 20 high Tech firms in NY - leveraging Google Maps API</li>
<li>How far each station is from surrounding Starbucks - leveraging Google Maps API </li>
<li> Female relative percentage at each station- leveraging US Census data</li>
</ul>

For each station, we assessed four aspects and assign a score on each aspect. Then we calculated weighted average of 4 scores to derive at final score for each station. The final scores were used for ranking purpose.

### Results

Stations were ranked based on the weighted average score of above four factors. Top stations and optimal time windows were identified.


### Conclusion and Next Steps

Recommended top stations and time windows to optimize the placement of street teams:
<ul>
<li>Time Square, E14th Street, Herald Square Stations were identified as top 3 stations</li>
<li>Friday and Saturday 7 p.m.-9 p.m. were identified as best time windows to maximize results</li>
</ul>
Next steps:
<ul>
<li>Evaluate tourist vs. resident impact on engagement</li>
<li>Other factors to consider: education, income level, and etc.</li>
</ul>
