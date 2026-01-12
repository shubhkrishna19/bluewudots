# CODEX MASTER PROTOCOL: The Bluewud OTS Development Bible

> **STATUS**: ACTIVE
> **LEAD ARCHITECT**: Codex
> **INFRASTRUCTURE & SYNC**: Antigravity

This document establishes the **Rules of Engagement**, **Architecture Standards**, and **Master Data Definitions** for the Bluewud OTS (Operations Tracking System). All agents must adhere strictly to these protocols to ensure the application remains stable while evolving.

---

## 1. 🏗️ Architecture & Environment

### **Core Stack**
*   **Runtime**: Node.js (v18+)
*   **Framework**: React 18 + Vite
*   **State Management**: `DataContext.jsx` (Global State) + `LocalizationContext.jsx` (i18n)
*   **Persistence**: `offlineCacheService.js` (IndexedDB Wrapper via `idb`)
*   **Styling**: Vanilla CSS (Variables in `App.css`). **NO** Tailwind (unless utility classes predefined), **NO** MUI/Bootstrap.

### **Server Ports (Strict)**
*   **`5173`**: Development Server (`npm run dev`) - *Hot Refresh, Debugging*.
*   **`5174/5175`**: Production Preview (`npm run build && npx vite preview`) - *Performance Testing*.

---

## 2. 📜 The "Bluewud Way": Coding Standards

### **A. UI/UX Principles (Glassmorphism)**
We follow a strict "Dark Elite" aesthetic.
*   **Containers**: Must use `.glass` or `.glass-dark` class.
*   **Interactivity**: Use `.glass-hover` for clickable cards/rows.
*   **Animations**: Wrap route transitions in `<div className="animate-fade">`.
*   **Colors**: Use CSS Variables:
    *   `var(--primary)`: Indigo/Blue (Actions)
    *   `var(--bg-dark)`: Deep Slate (Backgrounds)
    *   `var(--text-main)`: White (Primary Text)
    *   `var(--text-muted)`: Slate-400 (Secondary Text)

### **B. Component Architecture**
*   **Path**: `src/components/[Module]/[Component].jsx`
*   **Data Access**: Never fetch fetch directly in components. Use `useData()` hook.
    ```javascript
    // CORRECT
    const { orders, updateOrder } = useData();
    
    // WRONG
    const [orders, setOrders] = useState([]); 
    useEffect(() => fetch('/orders.json')..., []);
    ```
*   **Large Lists**: The app handles **32,000+ records**.
    *   **MANDATORY**: Pagination or Virtualization for any list > 50 items.
    *   **FORBIDDEN**: Rendering `orders.map()` directly without a slice/limit.

---

## 3. 💾 Data Masters (The Source of Truth)

### **A. The Datasets**
The app is powered by real historical data located in `public/data/`.
1.  **`orders.json`** (~32,330 Records)
    *   **Source**: `Order Tracking Sheet OTS - Master 24-25.xlsx`
    *   **Key Fields**: `id`, `orderDate` (ISO), `status`, `amount` (Float), `customer`.
2.  **`sales.json`** (~103,507 Records)
    *   **Source**: `Sales Trends FY2024-25 (1).xlsx`
    *   **Usage**: Financial Analytics & Demand Forecasting.
3.  **`skuMaster.json`** (~380 Records)
    *   **Source**: Extracted Unique SKUs.
    *   **Usage**: Catalog management, dimensions, weight.

### **B. Date Handling Rule (CRITICAL)**
Excel dates are serial numbers (e.g., `45290`).
*   **Rule**: NEVER parse dates manually.
*   **Solution**: Use `src/utils/dateUtils.js` or the logic in `analyticsService.js` that checks:
    ```javascript
    const validDate = order.orderDate || order.createdAt;
    // Standardize to ISO String before display
    ```

---

## 4. 🧠 Business Logic Masters

### **A. RBAC (Role-Based Access Control)**
Defined in `src/services/rbacMiddleware.js`.
*   **`admin`**: Full Access.
*   **`ops_manager`**: Can View/Edit Orders, cannot see Financials.
*   **`warehouse`**: Can only see "Ready to Ship" orders and SKU Master.
*   **`finance`**: Can only see Analytics, Sales, and ledgers.

### **B. Order Lifecycle**
1.  **`Pending`**: Imported from Channel (Amazon/Shopify).
2.  **`Processing`**: Validated for Stock.
3.  **`Ready-to-Ship`**: AWB Assigned + Label Printed.
4.  **`In-Transit`**: Handed to Courier.
5.  **`Delivered`**: Customer received.
6.  **`RTO_INITIATED`**: Customer refused/undeliverable (High Priority Alert).

---

## 5. 🤝 Development Protocol (Multi-Agent Swarm)

### **A. The Command Center**
*   **Control File**: `AI_COMMAND_CENTER.md`
*   **Rule**: Before starting a task, mark it as `[Codex]` in the file.
*   **Rule**: After finishing, move it to "Completed".

### **B. Synchronization (Antigravity's Domain)**
*   **Codex**: Focus on `src/` code and logic.
*   **Antigravity**: Will handle `git pull/push`, data seeding scripts, and verifying production builds.
*   **Frequency**: Sync happens after every major feature completion.

---

## 6. ✨ Quality Standards (Human-Grade Code)

### **A. Error Handling**
*   **Rule**: Every `try/catch` block must log to `activityLogger`.
*   **Rule**: User-facing errors must show a friendly message, not raw exceptions.
*   **Example**: `"Unable to load orders. Please refresh."` NOT `"TypeError: undefined"`

### **B. Accessibility (a11y)**
*   All buttons must have `aria-label` if icon-only.
*   Forms must have `<label>` tags linked to inputs.
*   Keyboard navigation must work (Tab order, Enter to submit).

### **C. Code Comments**
*   **Rule**: Every service file must have a header comment explaining its purpose.
*   **Rule**: Complex logic (e.g., RTO risk calculation) must have inline comments.

### **D. Performance**
*   **Rule**: No synchronous loops over 32k+ records in the main thread.
*   **Solution**: Use Web Workers or `requestIdleCallback` for heavy processing.

---

**SIGNED & RATIFIED**
*   **Antigravity AI** (Infrastructure Lead)
*   **Codex** (Lead Architect)
*   **Date**: 2026-01-12
