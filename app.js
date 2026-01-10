// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDAcuwo5FZBs5013klfSMfWkQZbFjqYpbw",
  authDomain: "novo-rid-dezembro.firebaseapp.com",
  projectId: "novo-rid-dezembro"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================= CONTROLE DE TELAS =================
const home = document.getElementById("home");
const formulario = document.getElementById("formulario");
const ridForm = document.getElementById("ridForm");

function mostrarFormulario() {
  home.classList.add("hidden");
  formulario.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function voltarHome() {
  formulario.classList.add("hidden");
  home.classList.remove("hidden");
  ridForm.reset();
}

// ================= SUBMIT (SEM ridNumber) =================
ridForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const f = e.target;

    // 🔥 garante que status sempre exista
    const statusValue = f.status?.value || "PENDENTE";
    const immediateActionValue = f.immediateAction?.value || "";

    await db.collection("rids").add({
      // 🔹 Identificação pública
      emitterId: "PUBLICO",
      emitterName: "VISITANTE/TERCEIRO",
      emitterCpf: "N/A",

      // 🔹 Dados do formulário
      contractType: f.contractType.value,
      unit: f.unit.value.toUpperCase(),
      emissionDate: firebase.firestore.Timestamp.fromDate(new Date(f.date.value)),
      incidentType: f.incidentType.value,
      detectionOrigin: f.detectionOrigin.value,
      location: f.location.value,
      description: f.description.value,
      riskClassification: f.riskClassification.value,

      // 🔥 Campos garantidos
      immediateAction: immediateActionValue,
      status: statusValue,

      // 🔹 Marca como RID pública
      isPublic: true,
      publicSource: "SITE_PUBLICO",

      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("RID enviada com sucesso!");
    voltarHome();

  } catch (error) {
    console.error(error);
    alert("Erro ao enviar RID. Verifique as permissões.");
  }
});
