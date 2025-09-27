const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testConnection() {

  // Test 1: Check Protection Officers
  const { data: officers, error: officersError } = await supabase
    .from('protection_officers')
    .select('*')
    .limit(5);

  if (officersError) {
    console.error('❌ Officers Error:', officersError);
  } else {
    if (officers && officers.length > 0) {
    }
  }

  // Test 2: Check Assignments
  const { data: assignments, error: assignmentsError } = await supabase
    .from('protection_assignments')
    .select('*')
    .limit(5);

  if (assignmentsError) {
    console.error('❌ Assignments Error:', assignmentsError);
  } else {
    if (assignments && assignments.length > 0) {
    }
  }

  // Test 3: Check Auth
  const { data: { user } } = await supabase.auth.getUser();

  // Test 4: Check Users table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);

  if (usersError) {
    console.error('❌ Users Error:', usersError);
  } else {
  }

  // Test 5: Check Vehicles table
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*')
    .limit(5);

  if (vehiclesError) {
    console.error('❌ Vehicles Error:', vehiclesError);
  } else {
    if (vehicles && vehicles.length > 0) {
    }
  }
}

testConnection().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('💥 Test failed:', err);
  process.exit(1);
});