# Operations Intelligence System - Data & Strategy Review

This document summarizes our current data integration and poses key strategic questions for the Bluewud leadership team.

## 1. Data Integration Status (Live Update)

The application is now being populated with **real historical data** extracted from Bluewud's legacy Excel sheets:

*   **Catalog (SKU Master)**: 379 unique SKUs identified (Child variations + MTPs).
*   **Operations (Orders)**: 32,330 historical order records processed (FY 24-25).
*   **Finance (Sales)**: 103,507 transaction records synced to the demand forecasting engine.
*   **Dimensions**: Product weight and box volume data mapped for shipping cost optimization.

---

## 2. Questions for Decision Makers (Feedback Needed)

As we transition from a prototype to a live operational tool, we need your guidance on the following "Business Rules":

### A. Order Status & Priorities
*   **The Question**: In your Order Tracking Sheet, we see statuses like "MIS", "D.OD", "STT.SD". Which of these means an order is "Critical" or "Delayed"?
*   **Normal Talk**: How should the system alert you if an order is stuck? For example, if an order hasn't moved in 3 days, should it turn red on the dashboard?

### B. "Alias" Handling
*   **The Question**: You sell the same products on Amazon, Myntra, and Pepperfry under different names (Aliases). Should the "Stock" view show them individually per platform, or grouped as one single product?
*   **Normal Talk**: If you have 10 units of a Shoe Rack, do you want to see that Amazon has 5 and Myntra has 5, or just that you have 10 in total?

### C. Predictive Risk (RTO/Returns)
*   **The Question**: Our AI flags certain cities or payment methods (COD) as "High Risk". At what point should the system "Block" an order from shipping?
*   **Normal Talk**: Should the system automatically hold a COD order if the customer has returned 2 items in the past, or just send an alert for manual review?

### D. User Access (Roles)
*   **The Question**: Currently, we have "Admin", "Warehouse", and "Finance" roles. Who should be allowed to edit SKU prices or approve courier refunds?
*   **Normal Talk**: Should the warehouse team be able to see the profit margins on an order, or should that only be visible to Finance?

---

## 3. Technical Requirements (Simplified)

To keep the app running at peak performance with this large volume of data (100k+ records), we recommend:

1.  **Browser Choice**: Use **Google Chrome** or **Microsoft Edge** for the best experience.
2.  **Internet**: A stable connection is required for initial sync, but the app works **offline** once data is loaded.
3.  **Security**: As this contains sensitive commercial data, please ensure all staff use unique passwords (which we can enforce in the next update).

---

## 4. Next Development Steps

1.  **UI Cleanup**: Refining colors and layouts to make the 32,000 orders easy to search through.
2.  **Report Automation**: Auto-generating the "Preferred Courier" recommendation based on your calculator logic.
3.  **ZPL Thermal Printing**: Finalizing the "One-Click Print" for warehouse labels.
