# 🚗 Vehicle Maintenance Scheduler Backend

A Node.js + Express backend that optimally schedules vehicle maintenance tasks across multiple depots using the **0/1 Knapsack Algorithm (Dynamic Programming)**.

## 📋 Overview

Given a set of vehicle maintenance tasks (each with a duration and impact score), and limited mechanic hours per depot, the system selects the optimal subset of tasks that **maximizes total impact** without exceeding available mechanic hours.

## ⚙️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Logging**: Winston + Morgan
- **Config**: dotenv

## 📁 Folder Structure

```
├── server.js                          # Entry point — starts the server
├── app.js                             # Express app setup & middleware pipeline
├── src/
│   ├── controllers/
│   │   └── scheduleController.js      # POST /schedule handler
│   ├── services/
│   │   ├── fetchService.js            # External API integration (depots, vehicles)
│   │   ├── knapsackService.js         # 0/1 Knapsack DP + backtracking
│   │   └── schedulerService.js        # Orchestrates the scheduling pipeline
│   ├── middlewares/
│   │   ├── loggerMiddleware.js        # Morgan → Winston HTTP logging
│   │   ├── errorMiddleware.js         # Global error handler
│   │   └── authMiddleware.js          # Authentication (placeholder)
│   ├── utils/
│   │   └── logger.js                  # Winston logger configuration
│   └── routes/
│       └── scheduleRoutes.js          # Route definitions
├── .env                               # Environment variables (not committed)
├── .env.example                       # Template for .env
└── package.json
```

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API credentials

# 3. Start the server
npm start

# Or with auto-restart on changes:
npm run dev
```

## 📡 API Usage

### POST /schedule

Triggers the maintenance scheduling optimization across all depots.

**Request:**
```bash
POST http://localhost:3000/schedule
```

**Response:**
```json
{
  "results": [
    {
      "depotId": 2,
      "totalDuration": 120,
      "totalImpact": 350,
      "selectedTasks": ["task-1", "task-4", "task-7"]
    },
    {
      "depotId": 3,
      "totalDuration": 175,
      "totalImpact": 480,
      "selectedTasks": ["task-2", "task-5", "task-8"]
    }
  ]
}
```

### GET /

Health check endpoint.

## 🧠 Knapsack Algorithm

### Problem Type: 0/1 Knapsack

Each maintenance task is either fully selected or not — no partial scheduling.

### Input
- **tasks**: Array of `{ TaskID, Duration, Impact }`
- **capacity**: Available `MechanicHours` for the depot

### Algorithm (Dynamic Programming)

```
1. Initialize: dp[w] = 0 for all w from 0 to capacity
2. For each task (duration d, impact v):
     For w = capacity down to d:
       dp[w] = max(dp[w], dp[w - d] + v)
3. Backtrack through decision matrix to recover selected tasks
```

### Why Not Greedy?

Greedy (sort by impact/duration ratio) does NOT guarantee optimal solutions for 0/1 Knapsack. Only DP gives the correct answer.

### Complexity

| Metric | Value |
|--------|-------|
| Time   | O(n × capacity) |
| Space  | O(n × capacity) |

Where `n` = number of tasks, `capacity` = mechanic hours.

### Edge Cases Handled

| Case | Behavior |
|------|----------|
| No vehicles | Returns empty result |
| Duration > capacity | Task is skipped |
| Impact = 0 | Task is skipped |
| Large input | Handles efficiently with 1D DP |

## 🔧 Middleware Pipeline

```
request → morgan logger → auth check → route → controller → service → response
                                                                    ↓ (on error)
                                                          error middleware → JSON error
```

## 📝 Logging

- **Console**: Colorized, human-readable logs
- **File**: `logs/combined.log` (all levels) + `logs/error.log` (errors only)
