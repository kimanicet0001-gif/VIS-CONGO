function toggleView(viewName) {
            document.getElementById('view-dashboard').classList.toggle('hidden', viewName !== 'dashboard');
            document.getElementById('view-registration').classList.toggle('hidden', viewName !== 'registration');
        }

        function loadPartners() {
            const list = document.getElementById('partners-list');
            const partners = JSON.parse(localStorage.getItem('visit_drc_partners')) || [];
            list.innerHTML = "";
            let counts = { "Hôtel": 0, "Véhicule": 0, "Guide": 0 };

            partners.forEach(p => {
                if (counts.hasOwnProperty(p.service)) counts[p.service]++;
                const row = `
                    <tr class="hover:bg-blue-50/50 transition-all fade-in">
                        <td class="px-6 py-4 font-bold text-slate-700">${p.name}</td>
                        <td class="px-6 py-4 text-xs font-bold ${p.service === 'Hôtel' ? 'text-blue-600' : p.service === 'Véhicule' ? 'text-orange-600' : 'text-green-600'}">${p.service}</td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-slate-600 font-medium">${p.phone || '-'}</div>
                            <div class="text-xs text-slate-400">${p.email || '-'}</div>
                        </td>
                        <td class="px-6 py-4 text-slate-500 text-sm">${p.location}</td>
                        <td class="px-6 py-4 text-right relative action-container">
                            <button class="text-slate-400 hover:text-[#06377b] font-bold p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
                            </button>
                            <div class="action-menu absolute right-0 top-0 mt-2 w-32 bg-white rounded-xl shadow-xl border z-10 overflow-hidden text-left">
                                <button onclick="editPartner('${p.id}')" class="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-bold">Modifier</button>
                                <button onclick="deletePartner('${p.id}')" class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold border-t">Supprimer</button>
                            </div>
                        </td>
                    </tr>`;
                list.insertAdjacentHTML('beforeend', row);
            });
            document.getElementById('count-hotel').innerText = counts["Hôtel"];
            document.getElementById('count-vehicule').innerText = counts["Véhicule"];
            document.getElementById('count-guide').innerText = counts["Guide"];
        }

        // FONCTION DE RÉCUPÉRATION TOTALE DES INFOS
        function editPartner(id) {
            const partners = JSON.parse(localStorage.getItem('visit_drc_partners')) || [];
            const p = partners.find(p => p.id === id);
            if(!p) return;

            // Chargement de TOUTES les infos existantes dans les champs
            document.getElementById('edit-id').value = p.id;
            document.getElementById('compName').value = p.name;
            document.getElementById('compLoc').value = p.location;
            document.getElementById('compEmail').value = p.email || "";
            document.getElementById('compPhone').value = p.phone || "";
            document.getElementById('adminUser').value = p.admin;
            document.getElementById('adminPass').value = p.pass || "";
            
            // Sélection du service actuel
            const radio = document.querySelector(`input[name="srv"][value="${p.service}"]`);
            if(radio) radio.checked = true;

            // Mise à jour visuelle pour informer l'admin qu'il modifie
            document.getElementById('form-title').innerText = "Modification de : " + p.name;
            const btn = document.getElementById('submit-btn');
            btn.innerText = "Appliquer les changements";
            btn.classList.replace('bg-[#06377b]', 'bg-orange-600');

            toggleView('registration');
        }

        function handleRegistration(e) {
            e.preventDefault();
            const editId = document.getElementById('edit-id').value;
            let partners = JSON.parse(localStorage.getItem('visit_drc_partners')) || [];

            const partnerData = {
                id: editId || Date.now().toString(),
                name: document.getElementById('compName').value,
                location: document.getElementById('compLoc').value,
                email: document.getElementById('compEmail').value,
                phone: document.getElementById('compPhone').value,
                service: document.querySelector('input[name="srv"]:checked').value,
                admin: document.getElementById('adminUser').value,
                pass: document.getElementById('adminPass').value
            };

            if(editId) {
                // Remplace les anciennes infos par les nouvelles choisies par l'admin
                partners = partners.map(p => p.id === editId ? partnerData : p);
            } else {
                partners.push(partnerData);
            }

            localStorage.setItem('visit_drc_partners', JSON.stringify(partners));
            resetFormState();
            toggleView('dashboard');
            loadPartners();
        }

        function cancelEdit() {
            resetFormState();
            toggleView('dashboard');
        }

        function resetFormState() {
            const btn = document.getElementById('submit-btn');
            document.getElementById('registrationForm').reset();
            document.getElementById('edit-id').value = "";
            document.getElementById('form-title').innerText = "Nouveau Partenaire";
            btn.innerText = "Confirmer l'ajout";
            btn.classList.remove('bg-orange-600');
            btn.classList.add('bg-[#06377b]');
        }

        function deletePartner(id) {
            if(confirm("Supprimer ce partenaire ?")) {
                let partners = JSON.parse(localStorage.getItem('visit_drc_partners')) || [];
                partners = partners.filter(p => p.id !== id);
                localStorage.setItem('visit_drc_partners', JSON.stringify(partners));
                loadPartners();
            }
        }