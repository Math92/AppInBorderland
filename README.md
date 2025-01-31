# App In Borderland

Un juego de cartas y desafíos inspirado en juegos de supervivencia, desarrollado con React y arquitectura moderna de componentes.

## 🎮 Descripción

App In Borderland es un juego web que simula un sistema de juegos de cartas donde los jugadores deben superar diferentes desafíos. Cada carta representa un tipo diferente de juego con su propia dificultad y mecánica.

## 🛠 Tecnologías Utilizadas

- React 18.3
- Vite 6.0
- ESLint 9.17
- CSS Modules
- Context API para manejo de estado

## 🏗 Estructura del Proyecto

```
appinborderland/
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameManager.jsx
│   │   │   ├── GameStart.jsx
│   │   │   └── RoundResults.jsx
│   │   └── ...
│   ├── context/
│   │   └── GameContext.jsx
│   ├── games/
│   │   └── spades/
│   │       ├── AceSpades.jsx
│   │       ├── TwoSpades.jsx
│   │       └── ThreeSpades.jsx
│   ├── data/
│   │   ├── cardData.js
│   │   └── charactersData.js
│   └── ...
```

## 🎴 Sistema de Juego

### Cartas
El juego utiliza un sistema de cartas basado en cuatro palos:
- ♠️ Picas (Spades): Juegos de lógica y estrategia
- ♥️ Corazones (Hearts): Juegos de resistencia física
- ♦️ Diamantes (Diamonds): Juegos de astucia y manipulación
- ♣️ Tréboles (Clubs): Juegos de trabajo en equipo

### Personajes
Los jugadores pueden elegir entre varios personajes, cada uno con habilidades únicas:
- Arisu: Experto en lógica (bonus en juegos de ♠️)
- Usagi: Atleta profesional (bonus en juegos de ♥️)
- Chishiya: Maestro de la manipulación (bonus en juegos de ♦️)
- Y más...

## 🎯 Juegos Implementados

### Juegos de Picas (♠️)
1. **As de Picas**: Golpes Rápidos
   - Dificultad: 1
   - Objetivo: Conseguir 50 clicks en 10 segundos

2. **Dos de Picas**: Mantén la Fuerza
   - Dificultad: 2
   - Objetivo: Mantener 80% de poder durante 15 segundos

3. **Tres de Picas**: Combo de Poder
   - Dificultad: 3
   - Objetivo: Completar 5 combos en 30 segundos

## 🔄 Flujo del Juego

1. Selección de personaje
2. Inicio de ronda
3. Selección de carta
4. Juego específico
5. Resultados de ronda
6. Repetir o finalizar


## 🎮 Cómo Jugar

1. Selecciona un personaje al inicio del juego
2. Se te asignará una carta aleatoria con un desafío
3. Completa el desafío dentro del tiempo límite
4. Observa tus resultados y los de otros jugadores
5. Continúa con la siguiente ronda

## 🧩 Arquitectura

### Context API
- `GameContext`: Maneja el estado global del juego
- `GameProvider`: Provee el estado y funciones a toda la aplicación

### Componentes Principales
- `GameManager`: Controla el flujo principal del juego
- `GameStart`: Maneja la selección de personajes
- `RoundResults`: Muestra resultados de cada ronda

## 🛠 Desarrollo

### Añadir Nuevos Juegos
1. Crear nuevo componente en la carpeta correspondiente
2. Añadir configuración en `types.js`
3. Implementar lógica del juego
4. Registrar en `GameManager.jsx`

### Añadir Nuevos Personajes
1. Añadir datos en `charactersData.js`
2. Implementar bonus específicos si es necesario

## 📝 Notas de Desarrollo

- El sistema está diseñado para ser fácilmente expandible
- Se pueden añadir nuevos tipos de juegos y cartas
- La dificultad se calcula automáticamente según el rango de la carta
- Sistema preparado para implementar más palos y rangos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.