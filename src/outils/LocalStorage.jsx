const CLE = "depenses";

export const saveDepenses = (depenses) => {
  try {
    localStorage.setItem(CLE, JSON.stringify(depenses));
    console.log("💾 Sauvegardé dans localStorage :", depenses);
  } catch (e) {
    console.error("❌ Erreur de sauvegarde :", e);
  }
};

export const getDepenses = () => {
  try {
    const data = localStorage.getItem(CLE);
    console.log("🔍 Récupéré depuis localStorage :", data);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("❌ Erreur de lecture :", e);
    return [];
  }
};
