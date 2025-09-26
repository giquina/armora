const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkTables() {
  console.log('🔍 Checking available tables...');

  // Try different possible table names
  const tableNames = [
    'protection_officers',
    'officers',
    'drivers',
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
        console.log(`✅ Table '${tableName}' exists - ${data?.length || 0} records sample`);
        if (data && data.length > 0) {
          console.log('   Sample data:', Object.keys(data[0]));
        }
      } else {
        console.log(`❌ Table '${tableName}': ${error.message}`);
      }
    } catch (err) {
      console.log(`❌ Table '${tableName}': ${err.message}`);
    }
  }
}

checkTables();