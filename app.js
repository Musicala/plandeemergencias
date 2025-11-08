/* Plan de Emergencias · Musicala · SGSST
   Interacciones: filtro, impresión, alto contraste, metadatos. */

(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Año footer y fecha de actualización (hoy)
  const now = new Date();
  $("#year").textContent = String(now.getFullYear());
  $("#lastUpdated").textContent = now.toLocaleDateString("es-CO", {
    year:"numeric", month:"long", day:"2-digit"
  });

  // Imprimir / Guardar PDF
  $("#btnImprimir").addEventListener("click", () => window.print());

  // Alto contraste (persistente)
  const CONTRAST_KEY = "mx-contraste";
  const applyContrast = (on) => {
    document.body.classList.toggle("high-contrast", !!on);
    const btn = $("#btnContraste");
    btn.setAttribute("aria-pressed", !!on);
    btn.textContent = on ? "Contraste normal" : "Alto contraste";
  };
  applyContrast(localStorage.getItem(CONTRAST_KEY) === "1");
  $("#btnContraste").addEventListener("click", () => {
    const on = !document.body.classList.contains("high-contrast");
    localStorage.setItem(CONTRAST_KEY, on ? "1" : "0");
    applyContrast(on);
  });

  // Filtro por texto: revisa headings, summary y listas
  const filtro = $("#filtro");
  filtro.addEventListener("input", () => {
    const q = filtro.value.trim().toLowerCase();
    // Filtra tarjetas y acordeones dentro de #contenido
    const sections = $$("#contenido .card, #contenido .accordion");
    sections.forEach(sec => {
      // si es details.accordion, evaluamos su summary + panel
      let text = "";
      if (sec.matches(".accordion")){
        const summary = sec.querySelector("summary")?.innerText || "";
        const panel = sec.querySelector(".panel")?.innerText || "";
        text = (summary + " " + panel).toLowerCase();
      } else {
        text = sec.innerText.toLowerCase();
      }
      const show = q.length === 0 || text.includes(q);
      sec.style.display = show ? "" : "none";
    });
  });

  // Accesibilidad: permitir abrir/cerrar summary con Enter
  $$(".accordion > summary").forEach(s => {
    s.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " "){
        ev.preventDefault();
        s.parentElement.open = !s.parentElement.open;
      }
    });
  });
})();
