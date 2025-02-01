// src/firebase.js
class LocalDB {
    constructor() {
        this.initializeCollections();
    }
 
    initializeCollections() {
        const collections = ['users'];
        collections.forEach(collection => {
            if (!localStorage.getItem(collection)) {
                localStorage.setItem(collection, JSON.stringify([]));
            }
        });
    
        // Verificar si el usuario de prueba ya existe
        const users = JSON.parse(localStorage.getItem('users'));
        const testUserExists = users.some(user => user.email === 'test@test.com');
        
        if (users.length === 0 && !testUserExists) {
            const defaultUser = {
                id: '1',
                email: 'test@test.com',
                password: '12345',
                cards: {
                    clubs: {},
                    diamonds: {},
                    hearts: {},
                    spades: {}
                }
            };
            localStorage.setItem('users', JSON.stringify([defaultUser]));
        }
    }
 
    collection(name) {
        return {
            add: async (data) => {
                const items = JSON.parse(localStorage.getItem(name) || '[]');
                const newItem = { 
                    ...data, 
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2) 
                };
                items.push(newItem);
                localStorage.setItem(name, JSON.stringify(items));
                return { id: newItem.id };
            },

            get: async () => {
                return JSON.parse(localStorage.getItem(name) || '[]');
            },

            where: (field, operator, value) => {
                return {
                    get: async () => {
                        const items = JSON.parse(localStorage.getItem(name) || '[]');
                        return items.filter(item => {
                            switch (operator) {
                                case '==':
                                    return item[field] === value;
                                case '>=':
                                    return item[field] >= value;
                                case '<=':
                                    return item[field] <= value;
                                case '!=':
                                    return item[field] !== value;
                                case 'in':
                                    return value.includes(item[field]);
                                default:
                                    return true;
                            }
                        });
                    }
                };
            },

            doc: (id) => ({
                get: async () => {
                    const items = JSON.parse(localStorage.getItem(name) || '[]');
                    const item = items.find(item => item.id === id);
                    return item || null;
                },

                update: async (data) => {
                    const items = JSON.parse(localStorage.getItem(name) || '[]');
                    const index = items.findIndex(item => item.id === id);
                    if (index !== -1) {
                        items[index] = { ...items[index], ...data };
                        localStorage.setItem(name, JSON.stringify(items));
                    }
                    return true;
                },

                delete: async () => {
                    const items = JSON.parse(localStorage.getItem(name) || '[]');
                    const filtered = items.filter(item => item.id !== id);
                    localStorage.setItem(name, JSON.stringify(filtered));
                    return true;
                }
            })
        };
    }
}
 
export const db = new LocalDB();