// Register.jsx
import { useState } from 'react';
import { db } from '../../firebase';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }
    
    if (password.length < 5) {
      setError('La contraseña debe tener al menos 5 caracteres');
      return;
    }

    try {
      // Verificar si el email ya existe
      const existingUsers = await db.collection('users').where('email', '==', email).get();
      
      if (existingUsers.length > 0) {
        setError('Este email ya está registrado');
        return;
      }

      // Crear nuevo usuario con la estructura completa
      const newUser = {
        email: email.toLowerCase(),
        password,
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        gamesPlayed: 0,
        gamesWon: 0,
        totalCards: 0
      };

      const result = await db.collection('users').add(newUser);

      if (result.id) {
        // Iniciar sesión automáticamente
        localStorage.setItem('currentUser', JSON.stringify({
          id: result.id,
          email: newUser.email,
          cards: newUser.cards
        }));
        window.location.href = '/'; // Redirigir al juego
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error en el registro: ' + (error.message || 'Intente nuevamente'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Registro</h2>
        
        {error && (
          <div className={`${styles.message} ${styles.error}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          
          <button type="submit" className={styles.button}>
            Registrarse
          </button>
        </form>

        <button 
          onClick={() => window.location.href = '/login'}
          className={styles.switchButton}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
};

export default Register;