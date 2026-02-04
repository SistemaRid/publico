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

    // ================= RID NUMBER (contador) =================
const counterRef = db.collection("counters").doc("rids");

let ridNumber = null;

await db.runTransaction(async (tx) => {
  const snap = await tx.get(counterRef);
const current = snap.exists ? (snap.data().lastNumber || 0) : 0;
const next = current + 1;

// grava no MESMO campo que o privado usa
tx.set(counterRef, { lastNumber: next }, { merge: true });

ridNumber = String(next).padStart(5, "0");

});


 await db.collection("rids").add({
  // 🔒 Identidade pública controlada
  emitterId: "PUBLIC",
  emitterName: "VISITANTE/TERCEIRO",
  emitterCpf: "00000000000",
  ridNumber,

  // 📄 Campos iguais ao site privado
  contractType: f.contractType.value,
  unit: f.unit.value.toUpperCase(),

  emissionDate: firebase.firestore.Timestamp.fromDate(
    new Date(f.date.value)
  ),

  incidentType: f.incidentType.value,
  detectionOrigin: f.detectionOrigin.value,
  location: f.location.value,
  description: f.description.value,
  riskClassification: f.riskClassification.value,
  immediateAction: immediateActionValue,

  status: f.status.value, // VENCIDO ou CORRIGIDO

  // 🔔 Worker
  emailSent: false,

  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});



    alert("RID enviada com sucesso!");
    voltarHome();

  } catch (error) {
    console.error(error);
    alert("Erro ao enviar RID. Verifique as permissões.");
  }
});
