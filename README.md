# Indian Equity Research Dashboard

A professional stock market research and technical analysis dashboard for Indian equities (BSE/NSE), built with React, TypeScript, and Vite.

![Dashboard Screenshot](https://github.com/user-attachments/assets/0669c7c1-c107-4f05-bced-f97e500de4f9)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shivanshdm261073-create/new.git
cd new
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000** in your browser.

### 4. Build for production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` folder. You can serve them with:

```bash
npm run preview
```

## How to Use

### Search for Stocks

Type a stock ticker (e.g. `RELIANCE`, `TCS`) in the search bar at the top and click **Search** to load data for that stock.

### Overview Section

The hero strip at the top displays key information at a glance:

- **Company name**, NSE/BSE codes, and sector
- **Current price** with daily change (₹ and %)
- **52-week range** visualizer showing where the current price sits
- **Key metrics**: Market Cap, P/E ratio, EPS, and Dividend Yield
- **AI Insight** summary for the stock

### Technical Analysis Charts

#### Timeframe Selection

Use the timeframe buttons (**1D**, **1W**, **1M**, **3M**, **6M**, **1Y**, **3Y**, **5Y**) to change the chart period.

#### Overlay Indicators

Toggle overlay indicators on the main price chart by clicking the indicator pills:

| Indicator | Description |
|-----------|-------------|
| **SMA 20 / 50 / 200** | Simple Moving Averages |
| **EMA 9 / 21** | Exponential Moving Averages |
| **Bollinger** | Bollinger Bands (upper, middle, lower) |
| **VWAP** | Volume Weighted Average Price |

#### Sub-Indicators

Toggle additional indicator panes below the main chart:

| Indicator | Description |
|-----------|-------------|
| **RSI (14)** | Relative Strength Index with overbought/oversold levels |
| **MACD** | Moving Average Convergence Divergence with signal line |
| **Stoch** | Stochastic Oscillator (%K and %D lines) |
| **ADX** | Average Directional Index for trend strength |

#### Pattern Recognition & Fibonacci

- Click **Patterns** to view AI-detected chart patterns (e.g. Golden Cross, Bull Flag) with confidence scores
- Click **Fibonacci** to display Fibonacci retracement levels on the chart

### Navigation Tabs

Use the sticky navigation bar to jump between sections:

- **Overview** – Company snapshot and key metrics
- **Technicals** – Charts and technical analysis tools

> **Note:** Fundamentals, Valuation, Macro, Micro, Industry, and AI Insights tabs are planned for future releases.

## Tech Stack

- **React 18** – UI framework
- **TypeScript** – Type safety
- **Vite** – Build tool and dev server
- **TailwindCSS** – Styling
- **Recharts** – Charting library
- **Zustand** – State management
- **Framer Motion** – Animations
- **Axios** – HTTP client

## Project Structure

```
├── public/
│   └── mock-data/          # Mock stock data (JSON)
├── src/
│   ├── components/         # React components
│   │   ├── charts/         # Chart and indicator components
│   │   ├── common/         # Shared UI components
│   │   ├── hero/           # Hero strip component
│   │   └── layout/         # Navigation and layout
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Data fetching services
│   ├── store/              # Zustand state store
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Formatters and data generators
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── index.html              # HTML entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## License

This project is for educational and research purposes.
