(() => {
  document.querySelectorAll("[data-relational-example]").forEach(example => {
    const documentObject = Object.freeze({ id: "doc:42", label: "Release notes" });
    const projects = { atlas: "Project Atlas", boreal: "Project Boreal" };
    const controls = example.querySelector(".platform-relations-controls");
    const selectMembership = key => {
      if (!Object.hasOwn(projects, key)) return;
      const project = projects[key];
      const other = projects[key === "atlas" ? "boreal" : "atlas"];
      example.dataset.membership = key;
      controls.querySelectorAll("[data-membership-choice]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.membershipChoice === key));
      });
      example.querySelectorAll("[data-project-edge]").forEach(edge => {
        edge.style.display = edge.dataset.projectEdge === key ? "" : "none";
      });
      example.querySelectorAll("[data-project-node]").forEach(node => {
        node.dataset.current = String(node.dataset.projectNode === key);
      });
      example.querySelector("[data-project-view]").textContent = project;
      example.querySelector("[data-mobile-project]").textContent = project;
      example.querySelector("[data-query-atlas]").textContent = key === "atlas" ? documentObject.id : "No matching document";
      example.querySelector("[data-query-boreal]").textContent = key === "boreal" ? documentObject.id : "No matching document";
      example.querySelector("[data-relations-status]").textContent = key === "atlas"
        ? `Before: ${documentObject.label} belongs to Atlas. Its identity is ${documentObject.id}.`
        : `After: ${documentObject.label} belongs to Boreal. Identity ${documentObject.id}, author, producing task and incoming reference are unchanged.`;
      example.querySelector("[data-relations-description]").textContent = `${project} includes ${documentObject.label}. Mira authored it, Task 17 produced it, and Review memo references it. Every route reaches the same object, ${documentObject.id}. ${other} has no membership edge to this document. The project queries reflect this membership; the persistent reference still identifies ${documentObject.id}.`;
    };
    controls.addEventListener("click", event => {
      const button = event.target.closest("button[data-membership-choice]");
      if (button && controls.contains(button)) selectMembership(button.dataset.membershipChoice);
    });
    selectMembership("atlas");
    controls.hidden = false;
  });
})();
