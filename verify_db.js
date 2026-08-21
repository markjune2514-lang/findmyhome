
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIntegrity() {
  const { data, error } = await supabase
    .from("properties")
    .select("id, unit_types, facilities");

  if (error) {
    console.error("Error fetching properties:", error);
    return;
  }

  let malformedCount = 0;
  for (const prop of data) {
    let hasMalformed = false;
    
    // Check unit_types
    if (prop.unit_types) {
      if (typeof prop.unit_types === "string") {
        try {
          JSON.parse(prop.unit_types);
        } catch (e) {
          console.log(`Property ID ${prop.id} has malformed unit_types string: ${e.message}`);
          hasMalformed = true;
        }
      }
    }

    // Check facilities
    if (prop.facilities) {
      if (typeof prop.facilities === "string") {
        try {
          JSON.parse(prop.facilities);
        } catch (e) {
          console.log(`Property ID ${prop.id} has malformed facilities string: ${e.message}`);
          hasMalformed = true;
        }
      }
    }

    if (hasMalformed) {
      malformedCount++;
    }
  }

  if (malformedCount === 0) {
    console.log("No malformed JSON found in unit_types or facilities.");
  } else {
    console.log(`Found ${malformedCount} properties with malformed JSON.`);
  }
}

checkIntegrity();

