# Stocks

A modern, responsive stock price dashboard built with React, TypeScript, and Tailwind CSS. Track your favorite stocks with real-time data, interactive charts, and a clean, intuitive interface.


## API Configuration

The app uses Finnhub API for real-time stock data. The free tier includes:
- 60 API calls per minute
- Real-time stock quotes
- Company search functionality

**Note**: Historical chart data uses simulated data as it requires a paid Finnhub plan. Stock quotes are real when the API is available.

## Data Structure

### Mock Stock Database
The app includes a comprehensive mock stock database (`src/data/stocks.json`) containing 90+ popular stocks organized by sector:

- **Technology**: AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, NFLX, ADBE, CRM, ORCL, INTC, AMD, QCOM, CSCO, IBM
- **Financial**: JPM, BAC, WFC, GS, MS, C, AXP, USB, PNC, TFC, COF, SCHW, BLK, SPGI, MCO, ICE
- **Healthcare**: JNJ, PFE, UNH, ABBV, MRK, TMO, ABT, DHR, BMY, AMGN, GILD, CVS, CI, ANTM, HUM, ELV
- **Consumer**: PG, KO, PEP, WMT, HD, MCD, SBUX, NKE, DIS, CMCSA, VZ, T, COST, TGT, LOW, TJX
- **Industrial**: BA, CAT, GE, MMM, UPS, FDX, RTX, LMT, HON, EMR, ITW, ETN, PH, DOV, ROK, CMI
- **Energy**: XOM, CVX, COP, SLB, EOG, PXD, VLO, MPC, PSX, OXY, HAL, BKR, KMI, WMB, EQT, DVN
- **Materials**: LIN, APD, FCX, NEM, DD, DOW, NUE, BLL, ALB, IFF, VMC, MLM, BX, A, SHW, NEM
- **Real Estate**: AMT, PLD, CCI, EQIX, PSA, SPG, O, DLR, VICI, WELL, EQR, AVB, MAA, UDR, ESS, CPT
- **Utilities**: NEE, DUK, SO, D, AEP, XEL, SRE, WEC, ETR, AEE, DTE, CMS, PNW, ATO, LNT, WTRG

### Enhanced Search
The search functionality includes:
- **Exact symbol matching** (e.g., "AAPL")
- **Partial symbol matching** (e.g., "APP" finds "AAPL")
- **Company name matching** (e.g., "Apple" finds "AAPL")
- **Word-based matching** (e.g., "Micro" finds "Microsoft")
- **Fallback generation** for any searched symbol not in the database


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Finnhub API** for providing real-time stock data
- **Recharts** for the excellent charting library
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icon set

