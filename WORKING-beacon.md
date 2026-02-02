# Beacon - Product Strategist WORKING.md

**Last Updated:** February 1, 2026 - 11:00 PM

## Current Focus
Exploring UpNextAnalytics.app and identifying product opportunities for youth soccer stats platform.

## Documented Opportunities

### 1. Game Previews (Priority: High)
Pre-match analysis pages with:
- Team lineups (when available)
- Recent form indicators
- Head-to-head historical data
- Weather conditions for game day

**Why:** Parents/coaches check these before every game. High engagement touchpoint.

### 2. Stat Stories (Priority: High)
Shareable Instagram carousel cards featuring:
- Player highlight stats
- Team season milestones
- Game recaps in visual format

**Why:** Organic social growth driver. Competitors lack this native sharing feature.

### 3. Team Locker Room (Priority: Medium)
Private team dashboard for coaches/parents with:
- Roster management
- Schedule + game notifications
- Player stat access control
- Team-wide achievement tracking

**Why:**
- MLS NEXT clubs manage 50-200+ players across age groups
- No existing solution combines scheduling + stats in one place
- Creates stickiness - teams won't leave once roster data is in
- Premium tier opportunity (B2B model)

### 4. Scouting Combine (Priority: Medium)
Event-based stat tracking for tournaments and ID camps with:
- Tournament brackets and schedules
- Combine event results (sprints, agility, technical drills)
- Scout notes and player ratings
- Exportable prospect reports for college coaches

**Why:**
- Tournaments drive concentrated engagement (3-4 days of high activity)
- College coaches need standardized prospect data
- Event organizers need integration (ECNL, MLS NEXT, ID camps)
- Natural B2B2C distribution through tournament partnerships

### 5. Player Comparison Tool (Priority: Medium)
Side-by-side player comparison with:
- Direct stat comparison (goals, assists, minutes per goal)
- Form trending (last 5 games performance)
- Position-specific metrics (forwards vs defenders)
- Shareable comparison cards for social/media

**Why:**
- Parents constantly compare their kids to teammates/rivals
- College scouts compare prospects across clubs
- Coaches evaluate player pairing options
- High engagement Pro feature with viral potential

### 6. Automated Game Recaps (Priority: High) ⭐ NEW
AI-generated post-game narratives with:
- Auto-generated game summary (score, key moments, turning points)
- Scoring play breakdown (who scored, when, assist info)
- Statistical context (possession, shots, corners compared to season avg)
- Shareable recap cards for parents to post

**Why:**
- Parents want to share their kid's games on social media
- Currently no automated storytelling - raw stats aren't shareable
- Creates weekly engagement triggers (every game = content moment)
- Differentiates from static stat sites like Matchday or Soccerway
- Natural Pro feature - free users get basic, Pro gets full recaps

### 7. Achievement Milestones (Priority: Medium) ⭐ NEW
Player milestone tracking and notifications:
- Century club (100 games played)
- Goal milestones (25, 50, 100 goals)
- Perfect season achievements
- Birthday age-group promotions
- Push notifications for milestone events

**Why:**
- Parents obsess over milestones - it's why they share on Facebook
- Creates emotional engagement beyond stats
- Push notifications bring users back to the app
- Easy to implement on existing stat foundation
- Sticky feature - users stay to see when their kid hits next milestone

### 8. Live Match Center (Priority: High) ⭐ NEW
Real-time game tracking for spectators with QR code access:
- Live score updates (minute-by-minute)
- Event stream (goals, cards, subs, key plays)
- QR code at venue for instant spectator access
- Shareable "watching [player] live" link for parents not at game
- In-app monetization (spectator pay-per-view or premium match access)

**Why:**
- Grandparents, relatives, college recruiters can't attend every game
- Youth games have 50-100 spectators per team - many want remote access
- College coaches scout multiple games simultaneously - remote access is essential
- QR code at the field is frictionless entry point
- Creates new revenue stream (B2C spectator model)
- High engagement during live games drives app habit formation
- Differentiates from static stat sites - real-time is a game changer

## 9. Weather & Field Conditions Alert System ⭐ NEW
Real-time game day notifications for field closures and weather delays:
- Automated weather alerts (rain, lightning, extreme temps)
- Field status monitoring (often managed by parks departments)
- Push notifications when games are postponed or rescheduled
- "Game ON" confirmation alerts (parents obsessively check at 6am Saturday)
- Integration with league cancellation announcements

**Why:**
- Parents check 5-6 sources morning of games (league site, club email, weather app, park status, coach texts)
- Field cancellations are the #1 frustration in youth sports
- High anxiety period = high engagement opportunity
- Push notifications drive app habit formation
- Easy MVP: scrape/subscribe to league RSS feeds and weather alerts
- Natural premium feature: early alerts for Pro users (15 min advantage)
- Partners with Team Locker Room for complete game day experience

## Next Steps
- [ ] Validate Team Locker Room with 2-3 youth club contacts
- [ ] Sketch wireframe for core features
- [ ] Estimate dev effort with Forge
- [ ] Research tournament integration opportunities (ECNL, MLS NEXT events)

---

## 10. Youth Club Partnership Portal (B2B White-Label) ⭐ NEW OPPORTUNITY
White-label solution for youth soccer clubs with branded subdomains and custom features:

**Core Features:**
- Club-branded subdomain (e.g., `clubname.upnextanalytics.com`)
- Custom color scheme, logo, and branding
- Club-specific landing page with sponsor ad placement
- Bulk player roster import from existing systems
- Club-wide analytics dashboard (not just individual player views)
- Parent/player invite system with club approval workflow
- Club subscription tiers (per-team, per-age-group, or full club)
- API access for club websites integration

**Monetization Tiers:**
- Starter: Up to 3 teams ($99/month)
- Growth: Up to 10 teams ($249/month)
- Enterprise: Unlimited teams + API access ($499/month)

**Why This Matters:**
- Clubs have 50-200+ families - one deal = 50-200 new users
- White-label creates stickiness (can't switch without losing data)
- Recurring revenue model (monthly/yearly subscriptions)
- Club administrators become internal sales team (referrals)
- Sponsor ad placement creates additional revenue share
- Data network effect: more clubs = more cross-club analytics = more value

**Competitive Advantage:**
- TeamSnap and SportsEngine focus on scheduling, not stats
- GameChanger focuses on baseball/softball primarily
- No dedicated youth soccer stats platform offers white-label
- UpNextAnalytics can own this underserved segment

**Implementation Approach:**
1. Multi-tenancy architecture (club_id scoping on all data)
2. Custom domain/CNAME support for branded URLs
3. Theming engine (stored per club configuration)
4. Admin portal for club managers
5. Referral tracking for club-to-club expansion

**Success Metrics:**
- Clubs acquired (target: 5 in year 1)
- Users per club (target: 80%+ roster adoption)
- Retention rate (target: 95%+ annual renewal)
- Revenue per club (target: $2,400/year avg)

---

## 11. Rivalry Tracker ⭐ NEW (Feb 2, 2026)
Dedicated historical matchup tracking for divisional and regional rivals.

**Observed Gap:** Dashboard shows "Opp formWWDLW" for upcoming matches but lacks:
- Head-to-head record with this specific opponent
- Last 3-5 match results between these teams
- Historical venue/context (home vs away performance vs rival)
- "Rivalry streak" notifications (e.g., "3rd straight win over this rival")

**Core Features:**
1. **Rivalry Dashboard** - Teams you've faced 3+ times marked as rivals
2. **H2H History** - All-time record, last 5 meetings, goal differential
3. **Streak Tracking** - "3-game winning streak vs Real Salt Lake" or "0-3-1 vs LA Galaxy"
4. **Rivalry Alerts** - Notify when rivalry match is scheduled
5. **Shareable Rivalry Cards** - "3-0-1 all-time vs [rival]" share images

**Why Now:**
- Geographic rivalries drive engagement (parents track these obsessively)
- No competitor offers H2H history at youth level
- Natural Pro differentiator (free users see limited history)
- Low data lift (uses existing match results)

**Target Users:**
- Club coaches (know opponent history for tactical prep)
- Parents (emotional investment in beating rivals)
- Players (team culture around "never lose to [rival]")

**Monetization:**
- Free: Last 3 H2H results
- Pro: Full history, streak tracking, rivalry cards

**Differentiation:**
- Soccerway/Flashscore don't track youth club rivalries
- Creates emotional engagement beyond raw stats
- Drives weekly check-ins during rivalry weeks

**Next Steps:**
- [ ] Validate with 3 parents/coaches (do they track rivalries?)
- [ ] Sketch rivalry card design
- [ ] Estimate dev effort (Forge)

---

## 12. Game Day Companion ⭐ NEW (Feb 2, 2026)
Enhance game day experience with real-time context and remote spectating support.

**Observed Gap:** The app shows upcoming matches with opponent form (WWDLW), but parents/coaches lack:
- Real-time score updates when they can't attend
- Shareable "watching [player] today" links for family
- Push notifications for game events (goals, halftime, final)
- Weather/field condition alerts on game day

**Core Features:**
1. **Live Score Subscriptions** - Subscribe to specific players/teams for push updates
2. **Game Day Weather Widget** - Show forecast + field conditions for scheduled games
3. **Shareable "Live View" Links** - One-click share for relatives who can't attend
4. **Game Event Notifications** - Goals, halftime, red cards, final score
5. **Field Status Alerts** - Early warning for cancellations/postponements

**Why Now:**
- 13.8k+ players tracked = massive potential for push notification engagement
- Youth games have 50-100 spectators per team = 5-10x more interested parties than attendees
- Parents check multiple sources morning of games = high anxiety = high engagement opportunity
- No competitor offers MLS NEXT-specific game day companion

**Target Users:**
- Parents not attending games (work, other kids' games)
- Extended family (grandparents out of town)
- College scouts monitoring multiple games
- Club directors tracking team performance

**Monetization:**
- Free: Basic game time notifications (15 min delay)
- Pro: Real-time updates, field alerts, live view links

**Differentiation:**
- Static stat sites offer no real-time engagement
- League apps focus on scheduling, not fan experience
- Creates habitual app usage on game days

**Implementation Considerations:**
- Push notification infrastructure (Firebase Cloud Messaging)
- Weather API integration (OpenWeatherMap)
- Field status scraping (league websites, park departments)
- Shareable URL generation with unique game tokens

**Next Steps:**
- [ ] Interview 3 parents about game day information needs
- [ ] Sketch game day widget UI
- [ ] Estimate push notification infrastructure (Forge)
- [ ] Research weather/field status data sources

---

## 13. Player Timeline & Career Progression ⭐ NEW (Feb 2, 2026)
Track player development over time with historical trends and milestone tracking.

**Observed Gap:** Player profiles show current season stats (8 goals) but lack:
- Historical progression (goals by season, improvement trends)
- Age-group promotion tracking (U14 → U15 → U16 transition)
- Career milestone moments (first goal, 10th goal, 50th game)
- Season-over-season comparison
- Development trajectory visualization

**Current State:**
- Player card shows: Jordan Lee · 8 goals · Forward #9
- Missing: Last 3 seasons, age-group transitions, milestone context

**Core Features:**
1. **Season-by-Season Stats** - Goals, games played, per-90 stats across seasons
2. **Age-Group Transitions** - Track player movement through U13→U14→U15→U16→U17→U19
3. **Milestone Timeline** - "First career goal: Sept 2024", "50 games: Jan 2025"
4. **Development Graphs** - Visual improvement trends (scoring rate over time)
5. **Comparison View** - "vs. same age last season" context
6. **Shareable Progress Cards** - "Jordan's 2025: 12 goals (↑40% from 2024)"

**Why This Matters:**
- **Parents** obsess over their child's development - want to see improvement
- **College scouts** need to see trajectory, not just current stats
- **Players** take pride in milestone moments
- **Retention** - users return to see progression updates
- **Pro differentiator** - free users see current season only

**Target Users:**
- Parents tracking their child's development
- College recruiters evaluating prospects
- Club directors monitoring player growth
- Players themselves (older teens)

**Monetization:**
- Free: Current season + last season
- Pro: Full career history, milestone tracking, progress cards

**Competitive Advantage:**
- MLSNEXT.com doesn't show historical trends
- Soccerway/Flashscore lack youth-specific milestones
- Creates emotional attachment beyond raw stats

**Implementation:**
1. Backend: Season schema with year, age_group, goals, games
2. Milestone engine: Track "first X" moments automatically
3. Frontend: Timeline component + trend graphs
4. Sharing: Generate shareable milestone cards

**Next Steps:**
- [ ] Validate with 3 parents (do they track milestones?)
- [ ] Sketch timeline UI
- [ ] Estimate backend changes (Forge)
- [ ] Design milestone card templates

---

## 14. Team Comparison Tool ⭐ NEW (Feb 2, 2026 - 06:03)
Side-by-side team comparison for match preparation and rivalry analysis.

**Observed Gap:** Dashboard shows individual team pages with standings, but coaches/parents cannot:
- Compare two teams directly (side-by-side stats)
- See head-to-head historical record when viewing a team
- Compare offensive/defensive metrics between two clubs
- Track how a team performs against specific opponents

**Current State:**
- Team page shows: Record, form, power ranking, upcoming opponents
- Missing: Direct comparison with any other team

**Core Features:**
1. **Side-by-Side Comparison** - Compare any two teams across all metrics
2. **H2H Preview** - When viewing an opponent, show direct comparison
3. **Statistical Breakdown** - Goals scored, goals conceded, clean sheets, form
4. **Comparison Cards** - Shareable "Team A vs Team B" stats images
5. **Performance vs Opponent Type** - "vs. top 5 teams: 2-1-0" context

**Why This Matters:**
- **Coaches** need to prepare for specific opponents
- **Parents** want to know how their team matches up
- **College scouts** compare clubs when evaluating prospects
- **Media/content creators** need comparison素材 for match previews
- **Pro differentiator** - free users get basic, Pro gets full comparison

**Target Users:**
- Youth coaches (tactical preparation)
- Club directors (player placement decisions)
- Parents (rivalry engagement)
- College scouts (club comparisons)

**Monetization:**
- Free: Basic comparison (record, goals)
- Pro: Full stats, H2H history, comparison cards

**Competitive Advantage:**
- MLSNEXT.com doesn't offer team comparison
- Static stat sites lack interactive comparison
- Creates engagement during match week

**Implementation:**
1. API endpoint: `/api/teams/compare?teamA=X&teamB=Y`
2. UI: Side-by-side layout with expandable stat categories
3. H2H data: Query match history between two teams
4. Sharing: Generate shareable comparison cards

**Next Steps:**
- [ ] Validate with 2-3 coaches (do they compare teams?)
- [ ] Sketch comparison UI layout
- [ ] Estimate API changes (Forge)
- [ ] Design comparison card templates
