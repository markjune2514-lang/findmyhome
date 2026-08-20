import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('name', 'THE CITY ทวีวัฒนา');

  if (error) {
    console.error("Error fetching data:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("Error: Property 'THE CITY ทวีวัฒนา' not found in database.");
    return;
  }

  console.log(`Found ${data.length} records. Checking the first one:`);
  const prop = data[0];
  
  let allGood = true;

  // 1. name check
  if (prop.name === 'THE CITY ทวีวัฒนา') {
    console.log("✅ name: exactly 'THE CITY ทวีวัฒนา'");
  } else {
    console.log(`❌ name: expected 'THE CITY ทวีวัฒนา', got '${prop.name}'`);
    allGood = false;
  }

  // 2. project_highlights check
  if (prop.project_highlights && Array.isArray(prop.project_highlights) && prop.project_highlights.length > 0) {
    console.log(`✅ project_highlights: contains highlight text (Array length: ${prop.project_highlights.length})`);
    console.log(`   Highlights sample: ${prop.project_highlights.slice(0, 2).join(" | ")}`);
  } else if (prop.project_highlights && typeof prop.project_highlights === 'string' && prop.project_highlights.trim() !== '') {
    console.log(`✅ project_highlights: contains highlight text (String length: ${prop.project_highlights.length})`);
  } else {
    console.log(`❌ project_highlights: missing or empty`);
    allGood = false;
  }

  // 3. total_land_area check
  const areaRegex = /^\d+-\d+-\d+(\.\d+)? ไร่-งาน-ตร\.ว\.$/;
  if (prop.total_land_area && areaRegex.test(prop.total_land_area)) {
    console.log(`✅ total_land_area: format correct ('${prop.total_land_area}')`);
  } else {
    console.log(`❌ total_land_area: expected format 'XX-X-XX ไร่-งาน-ตร.ว.', got '${prop.total_land_area}'`);
    allGood = false;
  }

  // 4. total_units check
  if (typeof prop.total_units === 'number') {
    console.log(`✅ total_units: is a number (${prop.total_units})`);
  } else {
    console.log(`❌ total_units: expected number, got ${typeof prop.total_units} ('${prop.total_units}')`);
    allGood = false;
  }

  // 5. categorized_landmarks check
  if (prop.categorized_landmarks && Array.isArray(prop.categorized_landmarks) && prop.categorized_landmarks.length > 0) {
    let landmarksValid = true;
    for (const lm of prop.categorized_landmarks) {
      if (!lm.name || !lm.distance) {
        console.log(`   ❌ Landmark missing name or distance: ${JSON.stringify(lm)}`);
        landmarksValid = false;
      } else {
        if (!lm.distance.includes('กิโลเมตร') && !lm.distance.includes('กม.') && !lm.distance.includes('ม.')) {
           console.log(`   ❌ Landmark distance incorrect format: ${lm.distance}`);
           landmarksValid = false;
        }
        if (/^\d+\.\d+,\s*\d+\.\d+$/.test(lm.name)) {
           console.log(`   ❌ Landmark name looks like coordinates: ${lm.name}`);
           landmarksValid = false;
        }
      }
    }
    if (landmarksValid) {
      console.log(`✅ categorized_landmarks: valid structure and data (${prop.categorized_landmarks.length} items)`);
      console.log(`   Sample landmark: ${prop.categorized_landmarks[0].name} (${prop.categorized_landmarks[0].distance})`);
    } else {
      console.log(`❌ categorized_landmarks: contained invalid items.`);
      allGood = false;
    }
  } else {
    console.log(`❌ categorized_landmarks: missing or empty`);
    allGood = false;
  }

  console.log("\n--- Summary ---");
  if (allGood) {
    console.log("Everything looks correct!");
  } else {
    console.log("Some fields are incorrect or missing.");
  }
}

main();
