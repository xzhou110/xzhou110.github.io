---
layout: post
title: Unleash Marketing Power of Street Teams Using Data Science
---

### Problem Statement

WomenTechWomenYes (WTWY) holds an annual gala every summer. For this year, the organization planned to place marketing street teams at multiple NY MTA stations to generate buzz and raise awareness.

However, the organization was constrained by following factors:
<ul>
<li>Time constraint. Short timeline prior to the event </li>
<li>Funding constraint. Limited funding available</li>
<li>Labor constraint. Limited number of teams available </li>
</ul>


### Goals

Optimizing the placement of marketing team and effectiveness of the campaign. Following goals need to be achieved:
<ul>

<li>Raise fund</li>
<li>Raise brand awareness and reach</li>
<li>Increase the participation of women in technology </li>
</ul>


### Analysis

After thorough analysis, we believed following factors have strong impact to the street team marketing effectiveness (see table below).

We rated each MTA station on each of four factors, and calculated weighted average of four ratings to derive at overall rating of a station. The final ratings were used for ranking and recommendation purposes.
<table>
  <thead>
    <tr>
      <th style="text-align: left">Factor</th>
      <th style="text-align: center">Data Source</th>
      <th style="text-align: center">Details </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">Potential Market</td>
      <td style="text-align: center">MTA Traffic Data</td>
      <td style="text-align: left">Traffic around each MTA station</td>

    </tr>
    <tr>
      <td style="text-align: left">Professionals - High Tech Related</td>
      <td style="text-align: center">Google Maps API</td>
      <td style="text-align: left">How far each station is from surrounding top High-Tech firms</td>

    </tr>
    <tr>
      <td style="text-align: left">Lifestyle - Starbucks</td>
      <td style="text-align: center">Google Maps API</td>
      <td style="text-align: left">How far each station is from surrounding Starbucks</td>

    </tr>
    <tr>
      <td style="text-align:left">Demographics - Female Percentage</td>
      <td style="text-align: center">US Census Data</td>
      <td style="text-align: left">Female percentage around each MTA station</td>

    </tr>
  </tbody>
</table>



### Results

MTA stations were ranked based on the weighted average ratings of above four factors. Top stations and optimal time windows were identified as a result.


### Conclusion and Next Steps

Recommended top MTA stations and time windows to optimize the placement of street teams:
<ul>
<li>Time Square, E14th Street, Herald Square Stations were identified as top 3 stations to place street teams</li>
<li>Friday and Saturday 7 p.m.-9 p.m. were identified as best time windows to maximize results</li>
</ul>
Next steps:
<ul>
<li>Evaluate tourist vs. resident impact</li>
<li>Feedback and continuous improvement of rating system</li>
<li>Other factors to consider: related organizations, education, income level, and etc.</li>
</ul>

<img src="recommendation.png" height="240" width="900">
