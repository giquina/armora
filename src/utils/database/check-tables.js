const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkTables() {

  // Try different possible table names
  const tableNames = [
    'protection_officers',
    'officers',
    'protection officers',
    'protection_assignments',
    'assignments',
    'bookings',
    'profiles',
    'users',
    'vehicles'
  ];

  for (const tableName of tableNames) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error) {
        if (data && data.length > 0) {
        }
      } else {
      }
    } catch (err) {
    }
  }
}

checkTables();