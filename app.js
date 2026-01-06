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

    await db.collection("rids").add({
      // 👇 IDENTIFICAÇÃO PÚBLICA
      emitterId: "PUBLICO",
      emitterName: "VISITANTE/TERCEIRO",
      emitterCpf: "N/A",

      // 👇 DADOS DO FORMULÁRIO
      contractType: f.contractType.value,
      unit: f.unit.value,
      emissionDate: firebase.firestore.Timestamp.fromDate(new Date(f.date.value)),
      incidentType: f.incidentType.value,
      detectionOrigin: f.detectionOrigin.value,
      location: f.location.value,
      description: f.description.value,
      riskClassification: f.riskClassification.value,
      immediateAction: f.immediateAction.value,
      status: f.status.value,

      // 👇 CONTROLE
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("RID enviada com sucesso!");
    voltarHome();

  } catch (error) {
    console.error(error);
    alert("Erro ao enviar RID. Verifique as permissões.");
  }
});
