(() => {
  const routes = {
    all: {
      title: "Shells, Exobrain and services",
      copy: "Web and Unity implement Shell. Web contains Worker Studio as an application, including the Compass graph navigator. Shells connect user interaction to Exobrain's PIM and Molecule SSOT graph. Their media streams reach Mixer, which uses local models and emits NATS events.",
      steps: ["User / shells", "PIM / Molecule", "Services", "Mixer / NATS"]
    },
    interaction: {
      title: "Interaction / User → shell → PIM",
      copy: "The user interacts through a Web or Unity shell. Shell input reaches PIM, the linearizer of the Molecule graph. Driver agents have a separate direct input path to PIM.",
      steps: ["User", "Web / Unity shell", "PIM", "Molecule graph"]
    },
    media: {
      title: "Media / Shells → Mixer → NATS",
      copy: "Shells send video and audio streams into Mixer. Mixer calls local models and receives their results, then publishes events on NATS.",
      steps: ["Shell streams", "Mixer ↔ local models", "NATS events"]
    },
    services: {
      title: "Services / Applications, providers and local models",
      copy: "Worker Studio is an application inside the Web shell and connects coding-agent providers through adapters. Compass renders semantic graph relations; Reader handles reading and playback. Reader and Mixer both use local model services.",
      steps: ["Web / Worker Studio", "Agent adapters", "Reader", "Local models / Mixer"]
    }
  };
  document.querySelectorAll("[data-platform-map]").forEach(map => {
    const controls = map.querySelector(".platform-paths");
    const select = key => {
      const route = routes[key];
      if (!route) return;
      map.dataset.selected = key;
      map.querySelectorAll("[data-path]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.path === key)));
      map.querySelectorAll("[data-on]").forEach(element => {
        element.classList.toggle("is-muted", key !== "all" && !element.dataset.on.split(" ").includes(key));
      });
      map.querySelector("[data-route-label]").textContent = route.title;
      map.querySelector("[data-route-copy]").textContent = route.copy;
      map.querySelector("[data-route-steps]").replaceChildren(...route.steps.map(text => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      }));
    };
    controls.addEventListener("click", event => {
      const button = event.target.closest("button[data-path]");
      if (button) select(button.dataset.path);
    });
    controls.hidden = false;
    select("all");
  });
})();
