import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  Stack,
  TextField,
  Divider,
  Button,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import DepenseForm from "./components/DepenseForm";
import DepenseList from "./components/DepenseList";
import Total from "./components/Total";
import { getDepenses, saveDepenses } from "./outils/LocalStorage";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const [depenses, setDepenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [depenseEdit, setDepenseEdit] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [montantMax, setMontantMax] = useState("");
  const [dateFiltre, setDateFiltre] = useState("");
  const [showFiltres, setShowFiltres] = useState(false);
  const [categorieFiltre, setCategorieFiltre] = useState("");


  useEffect(() => {
    const data = getDepenses();
    setDepenses(data);
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      saveDepenses(depenses);
    }
  }, [depenses, isInitialLoad]);

  const ajouterDepense = (dep) => {
    if (depenseEdit) {
      setDepenses((prev) => prev.map((d) => (d.id === dep.id ? dep : d)));
    } else {
      setDepenses([dep, ...depenses]); // ajout en haut
    }
    setOpen(false);
    setDepenseEdit(null);
  };

  const supprimerDepense = (id) => {
    setDepenses(depenses.filter((d) => d.id !== id));
  };

  const handleOpen = () => {
    setDepenseEdit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDepenseEdit(null);
  };

  const depensesFiltrees = depenses.filter((dep) => {
    const matchMontant = montantMax ? dep.montant <= Number(montantMax) : true;
    const matchDate = dateFiltre ? dep.date === dateFiltre : true;
    const matchCategorie = categorieFiltre ? dep.categorie === categorieFiltre : true;
    return matchMontant && matchDate && matchCategorie;
  });

  // 📤 Export CSV
  const exportCSV = (data) => {
    const headers = ["Nom", "Date", "Montant", "Détails"];
    const rows = data.map((dep) => [
      dep.nom,
      dep.date,
      dep.montant,
      dep.details || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "depenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📄 Export PDF
  const exportPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des dépenses", 14, 20);

    const tableData = data.map((dep) => [
      dep.nom,
      dep.date,
      `${dep.montant} AR`,
      dep.details || "-",
    ]);

    autoTable(doc, {
      head: [["Nom", "Date", "Montant", "Détails"]],
      body: tableData,
      startY: 30,
    });

    doc.save("depenses.pdf");
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Card elevation={6} sx={{ borderRadius: 4 }}>
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#2e7d32",
              p: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
                Gestionnaire de dépenses personnelles
              </Typography>
              <IconButton
                onClick={handleOpen}
                sx={{
                  backgroundColor: "#fff",
                  color: "#2e7d32",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <CardContent sx={{ pt: 3, px: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Total depenses={depensesFiltrees} />
            </Box>

            {/* Actions : Filtrer + Export */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                onClick={() => setShowFiltres(!showFiltres)}
                startIcon={<FilterListIcon />}
                sx={{
                  background: "linear-gradient(45deg, #43a047, #66bb6a)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #388e3c, #4caf50)",
                  },
                }}
              >
                Filtrer les dépenses
              </Button>

              <Button variant="outlined" color="success" onClick={() => exportCSV(depensesFiltrees)}>
                Exporter CSV
              </Button>
              <Button variant="outlined" color="primary" onClick={() => exportPDF(depensesFiltrees)}>
                Exporter PDF
              </Button>
            </Stack>

            {/* Zone de filtre */}
            <Collapse in={showFiltres}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
                <TextField
                  label="Filtrer par date"
                  type="date"
                  value={dateFiltre}
                  onChange={(e) => setDateFiltre(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Montant max"
                  type="number"
                  value={montantMax}
                  onChange={(e) => setMontantMax(e.target.value)}
                  fullWidth
                />
                <TextField
  label="Catégorie"
  value={categorieFiltre}
  onChange={(e) => setCategorieFiltre(e.target.value)}
  fullWidth
/>

              </Stack>
              <Divider sx={{ mb: 2 }} />
            </Collapse>

            {/* Liste */}
            <Box sx={{ maxHeight: "50vh", overflowY: "auto", pr: 1 }}>
              <DepenseList
                depenses={depensesFiltrees}
                onDelete={supprimerDepense}
                onEdit={(dep) => {
                  setDepenseEdit(dep);
                  setOpen(true);
                }}
              />
              {depensesFiltrees.length === 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Aucune dépense ne correspond aux filtres.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{ maxWidth: 600, width: "90%" }}>
            <DepenseForm
              onAdd={ajouterDepense}
              onClose={handleClose}
              depense={depenseEdit}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
