import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const db = getDatabase();

      // Crear nuevo usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Guardar nuevo usuario en la base de datos
      await set(ref(db, `users/${userId}`), {
        email: email.toLowerCase(),
        password,
        cards: {
          diamonds: {},
          spades: {},
          hearts: {},
          clubs: {}
        }
      });

      navigate('/game');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      <button className={styles.toggleButton} onClick={() => navigate('/login')}>
        ¿Ya tienes una cuenta? Inicia sesión
      </button>
    </div>
  );
};

export default Register;