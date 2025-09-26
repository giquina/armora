const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', process.env.REACT_APP_SUPABASE_URL);

  // Test 1: Check Protection Officers
  const { data: officers, error: officersError } = await supabase
    .from('protection_officers')
    .select('*')
    .limit(5);

  if (officersError) {
    console.error('❌ Officers Error:', officersError);
  } else {
    console.log('✅ Found', officers?.length || 0, 'Protection Officers');
    if (officers && officers.length > 0) {
      console.log('  Sample Officer:', officers[0].name, '-', officers[0].sia_license);
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
    console.log('✅ Found', assignments?.length || 0, 'Protection Assignments');
    if (assignments && assignments.length > 0) {
      console.log('  Sample Assignment:', assignments[0].status, '-', assignments[0].service_type);
    }
  }

  // Test 3: Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  console.log('✅ Auth Status:', user ? 'Authenticated' : 'Not authenticated');

  // Test 4: Check Users table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);

  if (usersError) {
    console.error('❌ Users Error:', usersError);
  } else {
    console.log('✅ Found', users?.length || 0, 'Users');
  }

  // Test 5: Check Vehicles table
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*')
    .limit(5);

  if (vehiclesError) {
    console.error('❌ Vehicles Error:', vehiclesError);
  } else {
    console.log('✅ Found', vehicles?.length || 0, 'Vehicles');
    if (vehicles && vehicles.length > 0) {
      console.log('  Sample Vehicle:', vehicles[0].make, vehicles[0].model, '-', vehicles[0].armor_level);
    }
  }
}

testConnection().then(() => {
  console.log('🎯 Connection test complete');
  process.exit(0);
}).catch(err => {
  console.error('💥 Test failed:', err);
  process.exit(1);
});