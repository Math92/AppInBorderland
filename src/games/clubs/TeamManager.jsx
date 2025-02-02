// TeamManager.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGame } from '../../context/GameContext';
import styles from './TeamManager.module.css';

const TeamManager = ({ teamSize, onTeamFormed = () => {}, children }) => {
    const { state } = useGame();
    const [team, setTeam] = useState([]);
    const [isTeamReady, setIsTeamReady] = useState(false);

    useEffect(() => {
        if (!isTeamReady && state.selectedCharacter) {
            const mainPlayer = state.selectedCharacter;
            const availablePartners = state.availableCharacters.filter(
                char => char.id !== state.selectedCharacter.id
            );

            if (availablePartners.length < teamSize - 1) {
                console.error("No hay suficientes personajes disponibles!");
                return;
            }

            const selectedPartners = [];
            const partnersNeeded = teamSize - 1;

            for (let i = 0; i < partnersNeeded; i++) {
                const randomIndex = Math.floor(Math.random() * availablePartners.length);
                selectedPartners.push(availablePartners.splice(randomIndex, 1)[0]);
            }

            const fullTeam = [mainPlayer, ...selectedPartners];
            setTeam(fullTeam);
            setIsTeamReady(true);
            onTeamFormed(fullTeam);
        }
    }, [state.selectedCharacter, teamSize, onTeamFormed, isTeamReady]);

    if (!isTeamReady) {
        return (
            <div className={styles.loading}>
                Formando equipo...
            </div>
        );
    }

    return children(team);
};

TeamManager.propTypes = {
    teamSize: PropTypes.number.isRequired,
    onTeamFormed: PropTypes.func,
    children: PropTypes.func.isRequired
};

export default TeamManager;