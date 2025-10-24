# Man Ki Bat Data Collection System

A full-stack web application for collecting and managing data from Mann Ki Baat program events across different Legislative Assembly Constituencies (LACs).

## Features

### User Features
- **LAC Selection**: Choose from Dhemaji, Sisiborgaon, or Jonai constituencies
- **Data Collection Form**: Submit event details including:
  - Polling station selection
  - Total attendances
  - Venue location
  - Eminent guests information
  - Front and back images of the event
- **Image Upload**: Upload event photos directly to cloud storage

### Admin Panel Features
- **Analytics Dashboard**:
  - Overall statistics (total submissions, attendances, stations)
  - LAC-wise detailed analytics
  - Completion rates with visual progress bars
- **Submissions List**:
  - View all submissions in table format
  - Serial number tracking
  - Image preview functionality
  - Sortable by date and LAC
- **Unsubmitted Stations**:
  - Filter by LAC
  - Track pending submissions
  - View completion status

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for images)
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Database Setup

Your Supabase database is already configured with the following:

### Tables
1. **polling_stations** - Stores all polling station information
2. **man_ki_bat_submissions** - Stores form submissions with event data

### Storage
- **man-ki-bat-images** bucket - Stores uploaded images (front and back photos)

### Environment Variables
The `.env` file contains your Supabase credentials:
```
VITE_SUPABASE_URL=https://dkmbhmdllvhxcjyngqzj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Verify Environment Variables

The `.env` file is already configured with your Supabase credentials. No changes needed!

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Make It Live (Deployment)

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

4. **Configure Environment Variables in Vercel**:
   - Go to your project settings in Vercel dashboard
   - Add the environment variables from your `.env` file:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Configure Environment Variables in Netlify**:
   - Go to Site settings > Environment variables
   - Add the variables from your `.env` file

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.ts`**:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   });
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

Note: GitHub Pages doesn't support environment variables directly. You'll need to hardcode them or use a different deployment method.

## Database Connection Details

### Supabase Project
- **URL**: `https://dkmbhmdllvhxcjyngqzj.supabase.co`
- **Project Reference**: `dkmbhmdllvhxcjyngqzj`

### Accessing Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Login to your account
3. Select your project: `dkmbhmdllvhxcjyngqzj`

### Managing Data
- **Table Editor**: View and edit data in your tables
- **SQL Editor**: Run custom SQL queries
- **Storage**: Manage uploaded images
- **Authentication**: Configure user access (currently set to public)

## How Image Upload Works

1. **User uploads image** in the data collection form
2. **Image is stored** in Supabase Storage bucket `man-ki-bat-images`
3. **File path structure**: `{LAC}/{timestamp}-{front/back}-{filename}`
4. **Public URL generated** for each image
5. **URL stored** in database (`front_image_url`, `back_image_url` columns)
6. **Admin panel fetches** images using stored URLs

### Image Storage Flow
```
User Upload → Supabase Storage → Generate Public URL → Save to Database → Display in Admin Panel
```

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── AdminAnalytics.tsx      # Analytics dashboard
│   │   ├── AdminPanel.tsx          # Main admin panel
│   │   ├── AdminSubmissions.tsx    # Submissions table
│   │   ├── DataCollectionForm.tsx  # User form
│   │   ├── Footer.tsx              # Footer component
│   │   ├── Header.tsx              # Header component
│   │   ├── HomePage.tsx            # Landing page
│   │   └── UnsubmittedStations.tsx # Unsubmitted tracker
│   ├── lib/
│   │   └── supabase.ts             # Supabase client config
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── supabase/
│   └── migrations/                 # Database migrations
├── .env                            # Environment variables
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Troubleshooting

### Images not uploading?
- Check if storage bucket `man-ki-bat-images` exists in Supabase dashboard
- Verify bucket is set to public
- Check browser console for errors

### Database connection issues?
- Verify `.env` file has correct Supabase credentials
- Check if tables exist in Supabase dashboard
- Ensure Row Level Security policies are configured

### Build fails?
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run typecheck`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Adding More Polling Stations

To add more polling stations to the database:

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:

```sql
INSERT INTO polling_stations (lac, station_name) VALUES
  ('LAC_NAME', 'Station Name 1'),
  ('LAC_NAME', 'Station Name 2');
```

Example:
```sql
INSERT INTO polling_stations (lac, station_name) VALUES
  ('Dhemaji', 'New Dhemaji Station'),
  ('Jonai', 'New Jonai Station');
```

## Security Notes

- Currently set to public access (no authentication required)
- Row Level Security (RLS) is enabled with public policies
- All users can submit forms and view data
- Storage bucket is public for easy image access

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Verify environment variables are correct

## License

This project is created for Mann Ki Baat program data collection.

---

**Important**: Keep your `.env` file secure and never commit it to public repositories!
