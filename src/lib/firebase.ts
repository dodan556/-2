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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Site Config Helper
export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const docSnap = await getDoc(doc(db, "site_config", "current"));
    if (docSnap.exists()) {
      return docSnap.data() as SiteConfig;
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

// Skills Helper
export async function fetchSkills(): Promise<SkillItem[] | null> {
  try {
    const docSnap = await getDoc(doc(db, "skills", "current"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.list as SkillItem[];
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

// Portfolio Items Helper
export async function fetchPortfolioItems(): Promise<PortfolioItem[] | null> {
  try {
    const q = query(collection(db, "portfolio_items"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const items: PortfolioItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Remove 'order' field when mapping back to PortfolioItem
        const { order, ...itemData } = data;
        items.push({ id: doc.id, ...itemData } as PortfolioItem);
      });
      return items;
    }
  } catch (err) {
    console.error("Error fetching portfolio items from Firestore:", err);
  }
  return null;
}

export async function savePortfolioItems(items: PortfolioItem[]): Promise<void> {
  try {
    // 1. Fetch current document IDs in Firestore to know what to delete
    const querySnapshot = await getDocs(collection(db, "portfolio_items"));
    const existingIds = new Set<string>();
    querySnapshot.forEach((doc) => {
      existingIds.add(doc.id);
    });

    const batch = writeBatch(db);

    // 2. Set/update documents in the new list with an 'order' field to maintain sorting
    const newIds = new Set<string>();
    items.forEach((item, index) => {
      const docRef = doc(db, "portfolio_items", item.id);
      batch.set(docRef, {
        ...item,
        order: index
      });
      newIds.add(item.id);
    });

    // 3. Delete documents that are no longer in the new list
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
