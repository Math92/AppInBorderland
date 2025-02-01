// firebase.js
import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  update, 
  query, 
  orderByChild, 
  equalTo, 
  push
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class FirebaseDB {
  async createUser(userData) {
    try {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      const usersRef = ref(database, 'users');
      const newUserRef = push(usersRef);
      const userId = newUserRef.key;
      const timestamp = new Date().toISOString();
      
      const newUser = {
        id: userId,
        email: userData.email,
        password: userData.password,
        cards: {
          spades: {
            "A": false, "2": false, "3": false, "4": false,
            "5": false, "6": false, "7": false, "8": false,
            "9": false, "10": false, "J": false, "Q": false, "K": false
          },
          hearts: {
            "A": false, "2": false, "3": false, "4": false,
            "5": false, "6": false, "7": false, "8": false,
            "9": false, "10": false, "J": false, "Q": false, "K": false
          },
          diamonds: {
            "A": false, "2": false, "3": false, "4": false,
            "5": false, "6": false, "7": false, "8": false,
            "9": false, "10": false, "J": false, "Q": false, "K": false
          },
          clubs: {
            "A": false, "2": false, "3": false, "4": false,
            "5": false, "6": false, "7": false, "8": false,
            "9": false, "10": false, "J": false, "Q": false, "K": false
          }
        },
        createdAt: timestamp,
        lastLogin: timestamp,
        gamesPlayed: 0,
        gamesWon: 0,
        totalCards: 0
      };

      await set(newUserRef, newUser);
      return { id: userId };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const usersRef = ref(database, 'users');
      const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(userQuery);
      
      if (!snapshot.exists()) {
        return null;
      }

      let user = null;
      snapshot.forEach((childSnapshot) => {
        user = { id: childSnapshot.key, ...childSnapshot.val() };
      });

      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async updateUserCards(userId, cards) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const totalCards = Object.values(cards).reduce((total, suit) => {
        return total + Object.values(suit).filter(card => card === true).length;
      }, 0);

      await update(userRef, { 
        cards,
        totalCards,
        lastUpdated: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error("Error updating cards:", error);
      throw error;
    }
  }

  collection(name) {
    return {
      where: (field, operator, value) => ({
        get: async () => {
          if (name === 'users' && field === 'email') {
            const user = await this.getUserByEmail(value);
            return user ? [user] : [];
          }
          return [];
        }
      }),

      add: async (data) => {
        if (name === 'users') {
          return await this.createUser(data);
        }
        throw new Error('Collection not supported');
      },

      doc: (id) => ({
        get: async () => {
          const snapshot = await get(ref(database, `${name}/${id}`));
          return snapshot.val();
        },
        update: async (data) => {
          if (data.cards) {
            return await this.updateUserCards(id, data.cards);
          }
          await update(ref(database, `${name}/${id}`), data);
          return true;
        }
      })
    };
  }
}

export const db = new FirebaseDB();