import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  writeBatch 
} from "firebase/firestore";
import { SiteConfig, SkillItem, PortfolioItem, ContactMessage } from "../types";
import { DEFAULT_SITE_CONFIG, DEFAULT_SKILLS, DEFAULT_PORTFOLIO_ITEMS } from "../data";

const firebaseConfig = {
  apiKey: "AIzaSyBFpAKR2Rnm_qiqYG3r63pceQjvXLZj_6c",
  authDomain: "project-psm-6676d.firebaseapp.com",
  projectId: "project-psm-6676d",
  storageBucket: "project-psm-6676d.firebasestorage.app",
  messagingSenderId: "773062713220",
  appId: "1:773062713220:web:343d5d9931a75d4f5a07d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Firestore Connection Test
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string; error?: any }> {
  try {
    // Attempt to read site_config/current as a test
    const docRef = doc(db, "site_config", "current");
    await getDoc(docRef);
    
    // Connection succeeded! Print the required console messages:
    console.log("Firebase Connected");
    console.log(firebaseConfig.projectId);
    
    return { success: true, message: "Successfully connected and verified Firestore read." };
  } catch (error: any) {
    // Connection failed! Print the required error console message:
    console.error(error);
    return { success: false, message: `Failed to connect or read site_config: ${error.message || error}`, error };
  }
}

// Site Config Helper with Auto-Seed fallback
export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const docRef = doc(db, "site_config", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteConfig;
    } else {
      console.log("site_config/current does not exist, seeding standard defaults...");
      await setDoc(docRef, DEFAULT_SITE_CONFIG);
      return DEFAULT_SITE_CONFIG;
    }
  } catch (err) {
    console.error("Error fetching site config from Firestore:", err);
  }
  return null;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  try {
    await setDoc(doc(db, "site_config", "current"), config);
  } catch (err) {
    console.error("Error saving site config to Firestore:", err);
  }
}

// Skills Helper with Auto-Seed fallback
export async function fetchSkills(): Promise<SkillItem[] | null> {
  try {
    const docRef = doc(db, "skills", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.list as SkillItem[];
    } else {
      console.log("skills/current does not exist, seeding standard defaults...");
      await setDoc(docRef, { list: DEFAULT_SKILLS });
      return DEFAULT_SKILLS;
    }
  } catch (err) {
    console.error("Error fetching skills from Firestore:", err);
  }
  return null;
}

export async function saveSkills(skills: SkillItem[]): Promise<void> {
  try {
    await setDoc(doc(db, "skills", "current"), { list: skills });
  } catch (err) {
    console.error("Error saving skills to Firestore:", err);
  }
}

// Portfolio Items Helper with Auto-Seed fallback
export async function fetchPortfolioItems(): Promise<PortfolioItem[] | null> {
  try {
    const q = query(collection(db, "portfolio_items"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const items: PortfolioItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { order, ...itemData } = data;
        items.push({ id: doc.id, ...itemData } as PortfolioItem);
      });
      return items;
    } else {
      console.log("portfolio_items collection is empty, seeding standard defaults...");
      const batch = writeBatch(db);
      DEFAULT_PORTFOLIO_ITEMS.forEach((item, index) => {
        const docRef = doc(db, "portfolio_items", item.id);
        batch.set(docRef, {
          ...item,
          order: index
        });
      });
      await batch.commit();
      return DEFAULT_PORTFOLIO_ITEMS;
    }
  } catch (err) {
    console.error("Error fetching portfolio items from Firestore:", err);
  }
  return null;
}

export async function savePortfolioItems(items: PortfolioItem[]): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, "portfolio_items"));
    const existingIds = new Set<string>();
    querySnapshot.forEach((doc) => {
      existingIds.add(doc.id);
    });

    const batch = writeBatch(db);
    const newIds = new Set<string>();
    items.forEach((item, index) => {
      const docRef = doc(db, "portfolio_items", item.id);
      batch.set(docRef, {
        ...item,
        order: index
      });
      newIds.add(item.id);
    });

    existingIds.forEach((id) => {
      if (!newIds.has(id)) {
        const docRef = doc(db, "portfolio_items", id);
        batch.delete(docRef);
      }
    });

    await batch.commit();
  } catch (err) {
    console.error("Error saving portfolio items to Firestore:", err);
  }
}

// Contact Messages Helper
export async function fetchContactMessages(): Promise<ContactMessage[] | null> {
  try {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
    });
    return messages;
  } catch (err) {
    console.error("Error fetching contact messages from Firestore:", err);
  }
  return null;
}

export async function saveContactMessage(msg: ContactMessage): Promise<void> {
  try {
    await setDoc(doc(db, "contact_messages", msg.id), msg);
  } catch (err) {
    console.error("Error saving contact message to Firestore:", err);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "contact_messages", id));
  } catch (err) {
    console.error("Error deleting contact message from Firestore:", err);
  }
}

export async function clearAllContactMessages(messages: ContactMessage[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    messages.forEach((msg) => {
      const docRef = doc(db, "contact_messages", msg.id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    console.error("Error clearing contact messages from Firestore:", err);
  }
}
