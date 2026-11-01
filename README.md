# Celebra AI – AI-Powered Celebration & Event Planner

**Tagline:** Your Celebration, Perfectly Planned.

Celebra AI is an intelligent, modern SaaS event planning application designed to transform abstract celebration ideas into complete, personalized, and actionable event masterplans. Built for organizing weddings, milestone birthdays, anniversaries, college fests, cultural celebrations, and community galas.

---

## 🌟 Key Features

1. **AI Master Event Planner (Google Gemini 3.8 Flash)**:
   - Overarching celebration concept, custom poetic tagline, and aesthetic vibe.
   - Curated color palettes with hex swatches and material guidelines.
   - Zonal decoration recommendations (Entrance, Stage, Dining, Photo Booth, Lighting).
   - Tailored catering menus (welcome drinks, pass-around starters, signature mains, desserts, dietary flags).
   - Day-of hourly run-of-show schedule.
   - Phased preparation milestone timelines.

2. **Smart Budget Planner & AI Cost Optimization**:
   - Comprehensive budget dashboard tracking Available Budget, Estimated Commitments, Actual Expenses, and Remaining Balance.
   - Category-wise spending visual charts (Recharts Donut distribution and Bar chart comparison).
   - Expense CRUD: Add, edit, delete, categorize (Venue, Catering, Decor, Photography, Entertainment, Invitations, Transportation, Misc), and track payment status (Paid, Partial, Pending).
   - **Gemini AI Budget Optimizer**: When costs exceed or approach the ceiling, AI identifies redundant items and suggests practical cost-saving alternatives without compromising guest delight.

3. **Smart Timeline & Task Manager**:
   - Phased event milestones with deadlines and priority badges (High, Medium, Low).
   - Automatic overdue task detection.
   - Progress bar tracking % of milestones executed.
   - Interactive task checklist with filters.

4. **Vendor Hub & Comparison Matrix**:
   - Dedicated management for Venues, Caterers, Decorators, Photographers, Entertainment, Makeup, and Logistics.
   - Booking status tracking: Shortlisted, Contacted, Booked, Completed.
   - Side-by-side vendor comparison matrix.
   - Transparent disclosure of sample demo records.

5. **Guest & RSVP Management**:
   - Track Confirmed, Pending, and Declined RSVPs.
   - Headcount calculation with plus-ones / family counts.
   - Dietary requirement breakdown: Vegetarian, Non-vegetarian, Jain (no root veg), Vegan, Kids.
   - Search, filter, and 1-click CSV export.

6. **Personalized Idea & Inspiration Generator**:
   - On-demand AI brainstorm across Themes, Decor & Lighting, Invitations Copy, Menu & Cocktails, Entertainment & Games, Return Gifts, and Host Surprises.
   - Budget ratings (Low, Medium, Luxury), "Why Guests Love It", and execution tips.

7. **24/7 Context-Aware Celebration Assistant Chatbot**:
   - Powered by Gemini 3.8 Flash.
   - Aware of the currently active celebration (name, city, guest count, budget, food style).
   - Quick suggested prompts and copyable responses.

---

## 🚀 Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express, Vite middleware integration, Google Gemini API via `@google/genai`.
- **Persistence**: LocalStorage with automatic backup, export, and import support.

---

## 🛠️ Environment Variables

Create a `.env` file or configure via AI Studio Secrets:

```bash
# Required for real-time Gemini AI plan generation and chat
GEMINI_API_KEY="your-gemini-api-key"

# Port (defaults to 3000)
PORT=3000
```

*Note: If `GEMINI_API_KEY` is not provided or quota is exceeded, Celebra AI automatically falls back to an intelligent curated celebration engine with realistic templates, ensuring the application remains 100% usable without crashing.*

---

## 💻 Local Development & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start fullstack development server (Express + Vite on port 3000):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```
