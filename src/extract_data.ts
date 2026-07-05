import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0862858522",
  appId: "1:959517487810:web:6e1675967ca2210c17815b",
  apiKey: "AIzaSyAdBJpqKmKUyYOdoZemLGowf9uIXO78Kn8",
  authDomain: "gen-lang-client-0862858522.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-3-e6b88e0c-4a46-45ca-b67d-a2d61f520701",
  storageBucket: "gen-lang-client-0862858522.firebasestorage.app",
  messagingSenderId: "959517487810",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function extract() {
  console.log("=== START EXTRACTION ===");
  try {
    const configSnap = await getDoc(doc(db, "site_config", "current"));
    if (configSnap.exists()) {
      console.log("CONFIG_FOUND:", JSON.stringify(configSnap.data(), null, 2));
    } else {
      console.log("CONFIG_NOT_FOUND");
    }

    const skillsSnap = await getDoc(doc(db, "skills", "current"));
    if (skillsSnap.exists()) {
      console.log("SKILLS_FOUND:", JSON.stringify(skillsSnap.data(), null, 2));
    } else {
      console.log("SKILLS_NOT_FOUND");
    }

    const portfolioSnap = await getDocs(collection(db, "portfolio_items"));
    if (!portfolioSnap.empty) {
      const items: any[] = [];
      portfolioSnap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // Sort by order field if present
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      console.log("PORTFOLIO_FOUND:", JSON.stringify(items, null, 2));
    } else {
      console.log("PORTFOLIO_NOT_FOUND");
    }
  } catch (err) {
    console.error("Extraction error:", err);
  }
  console.log("=== END EXTRACTION ===");
}

extract();
