import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function DepenseForm({ onAdd, onClose, depense }) {
  const [nom, setNom] = useState('');
  const [montant, setMontant] = useState('');
  const [details, setDetails] = useState('');
  const [categorie, setCategorie] = useState(''); // Nouveau state catégorie

  useEffect(() => {
    if (depense) {
      setNom(depense.nom);
      setMontant(depense.montant);
      setDetails(depense.details || '');
      setCategorie(depense.categorie || ''); // Charger catégorie si existante
    }
  }, [depense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !montant) return;

    const nouvelleDepense = {
      id: depense?.id || Date.now(),
      nom,
      montant: parseFloat(montant),
      date: depense?.date || new Date().toLocaleDateString(),
      details,
      categorie, // Ajouter la catégorie ici
    };

    onAdd(nouvelleDepense);
    setNom('');
    setMontant('');
    setDetails('');
    setCategorie(''); // Réinitialiser catégorie après ajout
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#fff',
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#555',
          '&:hover': { color: 'red' },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2e7d32' }}>
        {depense ? 'Modifier la dépense' : 'Ajouter une dépense'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Nom de la dépense"
            variant="outlined"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            fullWidth
          />
          <TextField
            label="Montant (Ar)"
            type="number"
            variant="outlined"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            fullWidth
          />
          <TextField
            label="Catégorie"
            variant="outlined"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            placeholder="Ex : Alimentaire, Transport, etc."
            fullWidth
          />
          <TextField
            label="Détails"
            variant="outlined"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            color="success"
            size="large"
          >
            {depense ? 'Modifier' : 'Ajouter'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
