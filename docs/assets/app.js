const $ = s => document.querySelector(s);
const content = $("#content"), nav = $("#navigation");
let current = "overview";
function renderNav(filter=""){
  nav.innerHTML = DOC.groups.map(g=>{
    const items=g.items.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
    return items.length?`<div class="nav-group"><div class="nav-label">${g.title}</div>${items.map(i=>`<a class="nav-link ${current===i.id?"active":""}" href="#${i.id}" data-page="${i.id}"><span class="nav-icon">${i.icon}</span>${i.label}</a>`).join("")}</div>`:"";
  }).join("");
}
function commandCards(group){
 const list=DOC.commands.filter(c=>c.group===group);
 if(!list.length)return '<div class="empty">Aucune commande enregistrée dans cette catégorie.</div>';
 return `<div class="command-list">${list.map((c,i)=>`<section class="command-card" data-search="${(c.name+" "+c.desc+" "+c.params.map(p=>p.join(" ")).join(" ")).toLowerCase()}">
 <div class="command-head" role="button" tabindex="0" aria-expanded="false"><div><div class="command-title">${c.name}</div><div class="command-desc">${c.desc}</div></div><span class="pill ${c.access==="Administrateur"?"admin":""}">${c.access}</span></div>
 <div class="command-body"><p>${c.behavior}</p>${c.params.length?`<h3>Paramètres</h3><table class="param-table"><thead><tr><th>Nom</th><th>Type</th><th>Requis</th><th>Description</th></tr></thead><tbody>${c.params.map(p=>`<tr><td><code>${p[0]}</code></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td></tr>`).join("")}</tbody></table>`:'<p class="tag">Aucun paramètre</p>'}
 <div class="callout"><strong>À savoir</strong><br>Cette fiche décrit l'interface de commande déclarée dans <code>deploy-commands.js</code>. Les règles métier détaillées peuvent dépendre de la version du code exécutée.</div></div></section>`).join("")}</div>`;
}
const pages={
 overview:()=>`<div class="hero"><div class="eyebrow">BOT DISCORD · GUIDE TECHNIQUE</div><h1>Bienvenue dans<br><em>4Tip.</em></h1><p class="lead">Le guide de référence pour comprendre, configurer et exploiter 4Tip : administration de serveur, collection Pokémon, suivi Twitch et intégrations League of Legends.</p><div class="hero-actions"><a class="button" href="#setup">Configurer le bot <span>→</span></a><a class="button secondary" href="https://github.com/ZePandawan/4Tip" target="_blank" rel="noreferrer">Explorer le code ↗</a></div></div>
 <div class="stats"><div class="stat"><strong>13</strong><span>commandes Slash déclarées</span></div><div class="stat"><strong>4</strong><span>domaines fonctionnels</span></div><div class="stat"><strong>Discord.js 14</strong><span>socle applicatif</span></div></div>
 <h2>Explorer 4Tip</h2><div class="card-grid">
 <div class="card"><div class="icon">⚙️</div><h3>Administration</h3><p>Avertissements, configuration des salons et publication des règles.</p><a href="#admin">Découvrir →</a></div>
 <div class="card"><div class="icon">✨</div><h3>Pokémon</h3><p>Capture, inventaire et échanges entre membres.</p><a href="#pokemon">Découvrir →</a></div>
 <div class="card"><div class="icon">🟣</div><h3>Twitch</h3><p>Gestion des streamers suivis et notifications de mise en ligne.</p><a href="#twitch">Découvrir →</a></div>
 <div class="card"><div class="icon">🎮</div><h3>League of Legends</h3><p>Statistiques, derniers matchs et suivi des joueurs.</p><a href="#lol">Découvrir →</a></div></div>
 <div class="callout"><strong>À propos de cette documentation</strong><br>Ce site documente les commandes déclarées et les mécanismes visibles dans le dépôt public. Il ne constitue pas une API HTTP : les commandes sont des interactions Discord Slash. Les éléments non confirmés par les fichiers consultés sont signalés comme tels.</div>`,
 admin:()=>section("Administration","Configuration du serveur, modération et accueil.", "admin"),
 pokemon:()=>section("Univers Pokémon","Capture et collection, consultation d'inventaire et échanges entre dresseurs.","pokemon"),
 twitch:()=>section("Suivi Twitch","Gérez les comptes suivis et les notifications de live.","twitch"),
 lol:()=>section("League of Legends","Statistiques classées et surveillance des nouvelles parties.","lol"),
 automation:()=>`<div class="section-head"><div><div class="eyebrow">FONCTIONNEMENT EN ARRIÈRE-PLAN</div><h1>Automatisations</h1><p>Processus lancés par le bot après sa connexion à Discord.</p></div></div>
 <div class="detail-panel"><h3>Surveillance Twitch</h3><p>Le bot appelle la vérification de statut des streamers toutes les 60 secondes après l'événement <code>ready</code>. Les notifications utilisent le salon de type <code>stream</code> configuré par serveur.</p><span class="tag">Intervalle : 60 secondes</span></div>
 <div class="detail-panel"><h3>Suivi League of Legends</h3><p>Le contrôle des nouvelles parties est déclenché toutes les 60 secondes. Le code contient également une ancienne configuration commentée à 120 secondes.</p><span class="tag">Intervalle actif : 60 secondes</span></div>
 <div class="detail-panel"><h3>Expiration des échanges Pokémon</h3><p>Les demandes d'échange anciennes sont nettoyées périodiquement. Le contrôle est programmé toutes les 30 secondes et conserve les échanges dont le timestamp est inférieur à deux minutes.</p><span class="tag">Nettoyage : 30 secondes · durée : 2 minutes</span></div>
 <div class="detail-panel"><h3>Expérience (XP)</h3><p>À chaque message d'un utilisateur non-bot, le gestionnaire appelle la fonction d'ajout d'XP. Les détails de progression et de récompenses sont à confirmer dans le module correspondant.</p></div>
 <div class="detail-panel"><h3>Statut du bot</h3><p>Le bot fait alterner ses activités Discord toutes les 30 secondes.</p></div>`,
 setup:()=>`<div class="section-head"><div><div class="eyebrow">MISE EN ROUTE</div><h1>Installation & configuration</h1><p>Préparer l'environnement, renseigner les clés et démarrer 4Tip.</p></div></div>
 <div class="detail-panel"><h3>1. Prérequis</h3><ul><li>Node.js compatible avec les dépendances du projet.</li><li>Application et bot créés dans le Discord Developer Portal.</li><li>Identifiants Twitch Developer pour les fonctions Twitch.</li><li>Clé Riot Games Developer pour les fonctions League of Legends.</li></ul></div>
 <div class="detail-panel"><h3>2. Installer le projet</h3><pre class="code">git clone https://github.com/ZePandawan/4Tip.git
cd 4Tip
npm install</pre></div>
 <div class="detail-panel"><h3>3. Configurer les identifiants</h3><p>Le dépôt attend le fichier <code>Config/config.json</code>. Ne publiez jamais ce fichier avec de vraies clés ou tokens.</p><pre class="code">{
  "clientId": "DISCORD_APPLICATION_ID",
  "guildId": "DISCORD_GUILD_ID",
  "token": "DISCORD_BOT_TOKEN",
  "twitchClientId": "TWITCH_CLIENT_ID",
  "twitchClientSecret": "TWITCH_CLIENT_SECRET",
  "riotApiKey": "RIOT_API_KEY"
}</pre><p>Les noms des propriétés doivent correspondre à ceux attendus par le code. Selon les modules utilisés, certaines intégrations peuvent nécessiter leurs identifiants même si vous n'activez pas toutes les fonctionnalités.</p></div>
 <div class="detail-panel"><h3>4. Déployer les commandes et démarrer</h3><pre class="code">node ./Code/deploy-commands.js
node ./Code</pre><p>Le script <code>deploy-commands.js</code> enregistre les commandes Slash globales de l'application. Le démarrage principal est effectué depuis le dossier <code>Code</code>.</p></div>
 <div class="callout"><strong>Important</strong><br>Le README du dépôt historique indique une commande de démarrage via <code>node ./Code</code>. Vérifiez la version de Node.js et la configuration de votre environnement avant un déploiement en production.</div>`,
 architecture:()=>`<div class="section-head"><div><div class="eyebrow">SOUS LE CAPOT</div><h1>Architecture & données</h1><p>Vue synthétique de l'organisation visible dans le dépôt.</p></div></div>
 <div class="detail-panel"><h3>Organisation du dépôt</h3><pre class="code">4Tip/
├── Code/
│   ├── commands/       # Un module par commande Slash
│   ├── database/       # Données persistées du bot
│   ├── deploy-commands.js
│   ├── functions.js
│   ├── check-streamer-status.js
│   ├── index.js        # Point d'entrée du bot
│   └── ...
├── Config/
│   └── config.json     # Configuration locale / secrets
├── docs/               # Site de documentation
├── package.json
└── README.md</pre></div>
 <div class="detail-panel"><h3>Technologies identifiées</h3><ul><li><strong>discord.js 14</strong> : client Discord, commandes Slash et composants interactifs.</li><li><strong>Twurple</strong> : intégration Twitch.</li><li><strong>Mongoose</strong> : dépendance MongoDB déclarée dans le projet.</li><li><strong>Fichiers JSON</strong> : plusieurs données locales du bot sont manipulées depuis le code.</li></ul></div>
 <div class="callout"><strong>Note sur la persistance</strong><br>La présence de Mongoose dans package.json ne signifie pas que toutes les données sont stockées dans MongoDB. Vérifiez chaque module de persistance avant de configurer une base de données externe.</div>`,
 security:()=>`<div class="section-head"><div><div class="eyebrow">BONNES PRATIQUES</div><h1>Sécurité & permissions</h1><p>Quelques règles essentielles pour héberger le bot sans exposer vos accès.</p></div></div>
 <div class="detail-panel"><h3>Protéger les secrets</h3><ul><li>Ne commitez jamais <code>Config/config.json</code> lorsqu'il contient des secrets.</li><li>En cas de fuite, révoquez immédiatement le token Discord et régénérez les clés concernées.</li><li>Limitez l'accès aux fichiers de configuration et aux sauvegardes.</li><li>Utilisez des variables d'environnement ou un gestionnaire de secrets pour un déploiement industrialisé, après adaptation du code.</li></ul></div>
 <div class="detail-panel"><h3>Permissions Discord</h3><p>Les commandes <code>/warn</code>, <code>/define-channel</code>, <code>/create-rules</code>, <code>/add-streamer</code> et <code>/remove-streamer</code> sont déclarées avec la permission Administrateur par défaut. Les permissions effectives dépendent également des autorisations accordées au bot dans le serveur.</p></div>
 <div class="detail-panel"><h3>Intents Discord</h3><p>Le client demande notamment les intents Guilds, GuildMembers, GuildVoiceStates, GuildMessages, MessageContent et GuildPresences. Certains intents privilégiés doivent être activés dans le portail développeur Discord et justifiés selon les usages du bot.</p></div>`,
};
function section(title,desc,group){return `<div class="section-head"><div><div class="eyebrow">COMMANDES DISCORD</div><h1>${title}</h1><p>${desc}</p></div><span class="tag">${DOC.commands.filter(c=>c.group===group).length} commandes</span></div>${commandCards(group)}`}
function route(){
 const id=location.hash.slice(1)||"overview";current=pages[id]?id:"overview";
 content.innerHTML=pages[current]();$("#crumb").textContent=DOC.groups.flatMap(g=>g.items).find(x=>x.id===current)?.label||"Vue d'ensemble";
 renderNav($("#search").value);
 content.querySelectorAll(".command-head").forEach(h=>{
   const toggle=()=>{const card=h.closest(".command-card");card.classList.toggle("open");h.setAttribute("aria-expanded",card.classList.contains("open"));};
   h.addEventListener("click",toggle);h.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle();}});
 });
 $("#sidebar").classList.remove("show");$("#overlay").classList.remove("show");
}
$("#search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 if(q){renderNav(q);content.querySelectorAll(".command-card").forEach(c=>{const match=c.dataset.search.includes(q);c.style.display=match?"":"none";if(match)c.classList.add("open");});}
 else route();
});
$("#navigation").addEventListener("click",e=>{const a=e.target.closest("[data-page]");if(a){e.preventDefault();location.hash=a.dataset.page;}});
$("#menuButton").addEventListener("click",()=>{$("#sidebar").classList.add("show");$("#overlay").classList.add("show");});
$("#overlay").addEventListener("click",()=>{$("#sidebar").classList.remove("show");$("#overlay").classList.remove("show");});
window.addEventListener("hashchange",route);route();
