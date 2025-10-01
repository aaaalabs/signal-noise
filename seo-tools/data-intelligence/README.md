# SEO Data Intelligence System

## Overview
Integrated SEO intelligence using Google Search Console and DataForSEO MCP servers for signal-noise.app.

## MCP Servers Installed

### 1. Google Search Console MCP (`gsc`)
- **Purpose**: Real-time Search Console data access
- **Credentials**: `~/.config/gsc-credentials/signal-noise-gsc.json`
- **Service Account**: `signal-noise@gen-lang-client-0028795317.iam.gserviceaccount.com`
- **Site**: https://signal-noise.app

**Available Tool**: `search_analytics`
- Extract performance data (clicks, impressions, CTR, position)
- Filter by query, page, country, device
- Date range analysis
- Up to 25,000 rows per request

### 2. DataForSEO MCP (`dfs-mcp`)
- **Purpose**: Keyword research and SERP analysis
- **Authentication**: Basic Auth (Base64 encoded credentials)
- **Endpoint**: https://mcp.dataforseo.com/http

**Available APIs**:
- Keywords Data API (search volume, trends)
- SERP API (competitor analysis)
- Content Analysis API

## Usage

The MCP servers are now available directly in Claude Code conversations. You can ask me to:

### Google Search Console Analysis
- "Show me the last 90 days of Search Console performance"
- "What are my top performing queries?"
- "Find quick win opportunities (positions 4-10)"
- "Analyze CTR by position"
- "Show pages with declining performance"

### DataForSEO Keyword Research
- "Validate search volumes for target keywords"
- "Check competition for 'signal vs noise productivity'"
- "Analyze SERP results for 'steve jobs productivity'"
- "Find related keywords for content expansion"

### Combined Insights
- "Compare actual search volumes vs. our estimates"
- "Find content gaps competitors are missing"
- "Prioritize next article based on real data"
- "Generate weekly SEO performance report"

## Directory Structure

```
data-intelligence/
├── README.md                    # This file
├── gsc/                         # Google Search Console data
│   └── (analysis outputs)
├── dataforseo/                  # DataForSEO research
│   └── (keyword research outputs)
├── combined-insights/           # Integrated analysis
│   └── (strategic reports)
└── reports/                     # Automated reports
    └── (weekly/monthly summaries)
```

## Next Steps

1. Request baseline performance analysis from GSC
2. Validate keyword volumes from `content-strategy-report.md`
3. Analyze competitor SERP positions
4. Generate first weekly intelligence report
5. Update master SEO strategy with real data

## Example Queries

**Quick Win Analysis**:
```
"Find all keywords ranking positions 4-10 with >100 monthly impressions"
```

**Keyword Validation**:
```
"Check actual search volume for:
- steve jobs productivity
- 80/20 rule productivity
- signal vs noise productivity"
```

**Competitor Analysis**:
```
"Analyze top 10 SERP results for 'information overload solutions'"
```

**Performance Tracking**:
```
"Show week-over-week performance changes for last 30 days"
```

---

**Status**: ✅ Both MCP servers installed and connected
**Last Updated**: 2024-10-01
