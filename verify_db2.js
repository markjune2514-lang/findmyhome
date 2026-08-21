
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

  let stringCount = 0;
  let objectCount = 0;
  let malformedCount = 0;

  for (const prop of data) {
    // Check unit_types
    if (prop.unit_types !== null && prop.unit_types !== undefined) {
      if (typeof prop.unit_types === "string") {
        stringCount++;
        try {
          JSON.parse(prop.unit_types);
        } catch (e) {
          console.log(`Property ID ${prop.id} has malformed unit_types string: ${e.message}`);
          malformedCount++;
        }
      } else {
        objectCount++;
      }
    }

    // Check facilities
    if (prop.facilities !== null && prop.facilities !== undefined) {
      if (typeof prop.facilities === "string") {
        stringCount++;
        try {
          JSON.parse(prop.facilities);
        } catch (e) {
          console.log(`Property ID ${prop.id} has malformed facilities string: ${e.message}`);
          malformedCount++;
        }
      } else {
        objectCount++;
      }
    }
  }

  console.log(`Found ${stringCount} string fields, ${objectCount} object fields.`);
  console.log(`Found ${malformedCount} malformed fields.`);
  
  if (data.length > 0) {
      console.log("Sample unit_types:", JSON.stringify(data[0].unit_types).substring(0, 100));
      console.log("Sample facilities:", JSON.stringify(data[0].facilities).substring(0, 100));
  }
}

checkIntegrity();

