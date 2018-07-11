---
layout: post
title: Harnessing Marketing Power of Street Teams Leveraging Data Science
---

### Problem Statement

WomenTechWomenYes (WTWY) holds an annual gala every summer. For this year, the organization planned to place marketing street teams at various NY MTA stations to generate buzz and raise awareness.

However, the organization was constrained by following factors:
<ul>
<li>Time constraint. Short timeline prior to the event </li>
<li>Funding constraint. Limited funding available</li>
<li>Labor constraint. Limited number of teams available. </li>
</ul>


### Goals

Optimizing the placement of marketing team and effectiveness of the campaign. Following goals should be achieved:
<ul>

<li>Raise fund</li>
<li>Raise brand awareness and reach</li>
<li>Increase the participation of women in technology </li>
</ul>


### Analysis

After thorough analysis, we believed following aspects have strong impact to the street team marketing effectiveness:

<table>
  <thead>
    <tr>
      <th style="text-align: center">Parameter</th>
      <th style="text-align: center">Corollary</th>
      <th style="text-align: center">Data Source</th>
      <th style="text-align: center">Scoring Metric</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center">Demographics</td>
      <td style="text-align: center">Gender Distribution</td>
      <td style="text-align: center">US Census 2010 Data</td>
      <td style="text-align: center">Number of women living in area</td>
    </tr>
    <tr>
      <td style="text-align: center">Interests</td>
      <td style="text-align: center">Starbucks</td>
      <td style="text-align: center">Google Maps API</td>
      <td style="text-align: center">Aggregate inverse distance to Starbucks locations within walking distance</td>
    </tr>
    <tr>
      <td style="text-align: center">Work</td>
      <td style="text-align: center">Tech Companies</td>
      <td style="text-align: center">Google Maps API</td>
      <td style="text-align: center">Aggregate inverse distance to top 21 tech companies</td>
    </tr>
  </tbody>
</table>

<ul>
<li>Traffic around each station - analysis leveraging MTA traffic data</li>
<li> How far each station is from surrounding top High-Tech firms - analysis leveraging Google Maps API</li>
<li>How far each station is from surrounding Starbucks - analysis leveraging Google Maps API </li>
<li> Female percentage at each station- analysis leveraging US Census data</li>
</ul>

For each MTA station, we assessed four aspects and assigned a score on each aspect. Then weighted average was calculated to derive at final score of each station. The final scores were used for ranking purpose.

### Results

MTA stations were ranked based on the weighted average scores of above four factors. Top stations and optimal time windows were identified.


### Conclusion and Next Steps

Recommended top MTA stations and time windows to optimize the placement of street teams:
<ul>
<li>Time Square, E14th Street, Herald Square Stations were identified as top 3 stations</li>
<li>Friday and Saturday 7 p.m.-9 p.m. were identified as best time windows to maximize results</li>
</ul>
Next steps:
<ul>
<li>Evaluate tourist vs. resident impact</li>
<li>Other factors to consider: education, income level, and etc.</li>
</ul>

<img src="final_finding.jpg" height="42" width="42">
