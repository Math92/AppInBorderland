// AuthView.jsx
import { useState } from 'react';
import { db } from '../../firebase';
import styles from './AuthView.module.css';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
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
        if (isLogin) {
            // Lógica de login
            const users = await db.collection('users').where('email', '==', email).get();
            
            if (!users || users.length === 0) {
                setError('Usuario no encontrado');
                return;
            }

            const user = users[0];
            if (!user || user.password !== password) {
                setError('Credenciales inválidas');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                email: user.email,
                cards: user.cards || {
                    clubs: {},
                    diamonds: {},
                    hearts: {},
                    spades: {}
                }
            }));
            window.location.reload();
        } else {
            // Verificar si el email ya existe
            const existingUsers = await db.collection('users').where('email', '==', email).get();
            
            if (existingUsers.length > 0) {
                setError('Este email ya está registrado');
                return;
            }

            // Lógica de registro
            const newUser = {
                email,
                password,
                cards: {
                    clubs: {},
                    diamonds: {},
                    hearts: {},
                    spades: {}
                }
            };
            
            const result = await db.collection('users').add(newUser);
            
            if (result.id) {
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setError('Usuario registrado correctamente');

                // Opcional: Login automático después del registro
                /*
                localStorage.setItem('currentUser', JSON.stringify({
                    id: result.id,
                    email: newUser.email,
                    cards: newUser.cards
                }));
                window.location.reload();
                */
            }
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Error en la operación: ' + (error.message || 'Intente nuevamente'));
    }
};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isLogin ? 'Iniciar Sesión' : 'Registro'}
        </h2>
        
        {error && (
          <div className={`${styles.message} ${
            error.includes('correctamente') ? styles.success : styles.error
          }`}>
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
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setEmail('');
            setPassword('');
          }}
          className={styles.switchButton}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;