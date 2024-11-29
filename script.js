document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const characterSearch = document.getElementById('character-search');
    const characterButtons = document.querySelectorAll('.tab-button');
    const characterContents = document.querySelectorAll('.character-content');
    const subtabButtons = document.querySelectorAll('.subtab-button');
    const subtabContents = document.querySelectorAll('.subtab-content');
    const ownedCheckboxes = document.querySelectorAll('.owned-checkbox');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebar');

    // Funkcja do automatycznego otwierania pierwszej podzakładki
    function openFirstSubtab(characterId) {
        const characterSection = document.getElementById(characterId);
        if (characterSection) {
            const firstSubtabButton = characterSection.querySelector('.subtab-button');
            const firstSubtabContent = characterSection.querySelector('.subtab-content');

            if (firstSubtabButton && firstSubtabContent) {
                // Usuń aktywne klasy z innych zakładek i podzakładek
                subtabButtons.forEach(btn => btn.classList.remove('active'));
                characterSection.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));

                // Aktywuj pierwszą podzakładkę
                firstSubtabButton.classList.add('active');
                firstSubtabContent.classList.add('active');
            }
        }
    }

    // Obsługa kliknięcia zakładek postaci
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');
            characterButtons.forEach(btn => btn.classList.remove('active'));
            characterContents.forEach(content => content.classList.remove('active'));

            // Aktywacja zakładki
            button.classList.add('active');
            const characterSection = document.getElementById(characterId);
            if (characterSection) {
                characterSection.classList.add('active');

                // Automatycznie otwórz pierwszą podzakładkę
                openFirstSubtab(characterId);
            }

            // Dostosuj wysokość sidebaru
            adjustSidebarHeight();
        });
    });

    // Funkcja do dostosowania wysokości sidebaru
    function adjustSidebarHeight() {
        const activeCharacter = document.querySelector('.character-content.active');
        if (activeCharacter) {
            const activeHeight = activeCharacter.offsetHeight;
            sidebar.style.height = `${activeHeight}px`;
        } else {
            sidebar.style.height = 'auto';
        }
    }

    // Wywołaj dostosowanie wysokości przy ładowaniu strony
    adjustSidebarHeight();
    
    // Funkcja do zapisywania aktualnego stanu zakładek i podzakładek
    function saveCurrentTabAndSubtab() {
        const activeCharacter = document.querySelector('.character-content.active');
        const activeSubtab = document.querySelector('.subtab-content.active');

        if (activeCharacter) {
            localStorage.setItem('activeCharacter', activeCharacter.id);
        }
        if (activeSubtab) {
            localStorage.setItem('activeSubtab', activeSubtab.id);
        }
    }

    // Funkcja do przywracania stanu zakładek i podzakładek
    function restoreTabsState() {
        const activeCharacterId = localStorage.getItem('activeCharacter');
        const activeSubtabId = localStorage.getItem('activeSubtab');

        if (activeCharacterId) {
            document.getElementById(activeCharacterId)?.classList.add('active');
            document.querySelector(`[data-character="${activeCharacterId}"]`)?.classList.add('active');
        }

        if (activeSubtabId) {
            document.getElementById(activeSubtabId)?.classList.add('active');
            document.querySelector(`[data-subtab="${activeSubtabId}"]`)?.classList.add('active');
        }
    }

    // Obsługa przycisku zwijania sidebaru
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleButton.textContent = sidebar.classList.contains('collapsed') ? '⮞' : '⮜';
		
		// Dodaj lub usuń klasę 'expanded' na głównym elemencie zawartości
        const mainContent = document.querySelector('.main-content');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.add('expanded');
        } else {
            mainContent.classList.remove('expanded');
        }
    });

    // Sprawdź zapisany tryb w localStorage
    if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    }

    // Obsługa trybu ciemnego
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode); // Zapisz stan w localStorage
    });

    // Obsługa wyszukiwania postaci
    characterSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        characterButtons.forEach(button => {
            const characterName = button.textContent.toLowerCase();
            const listItem = button.closest('li');

            if (listItem) {
                listItem.style.display = characterName.includes(query) ? '' : 'none';
            }
        });
    });

    // Obsługa kliknięcia zakładek postaci
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');
            characterButtons.forEach(btn => btn.classList.remove('active'));
            characterContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(characterId).classList.add('active');

            saveCurrentTabAndSubtab(); // Zapisz stan
        });
    });

    // Obsługa kliknięcia podzakładek
    subtabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtabId = button.getAttribute('data-subtab');
            subtabButtons.forEach(btn => btn.classList.remove('active'));
            subtabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(subtabId).classList.add('active');

            saveCurrentTabAndSubtab(); // Zapisz stan
        });
    });

    // Tooltipy
    characterButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            const tooltipText = button.getAttribute('data-tooltip');
            showTooltip(button, tooltipText);
        });

        button.addEventListener('mouseout', hideTooltip);
    });

    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Przywrócenie stanu zakładek i podzakładek po odświeżeniu
    restoreTabsState();

    
	
    const characterFilter = document.getElementById('character-filter');
    const roleFilter = document.getElementById('role-filter');
    const teams = document.querySelectorAll('.team');

    // Funkcja filtrowania drużyn
    function filterTeams() {
        const selectedCharacter = characterFilter.value.trim();
        const selectedRole = roleFilter.value.trim();

        

        teams.forEach(team => {
            let isVisible = false;

            // Iteracja po wszystkich postaciach w drużynie
            team.querySelectorAll('.team-role').forEach(roleElement => {
                const characterName = roleElement.querySelector('p[data-character]')?.getAttribute('data-character')?.trim();
                const characterRole = roleElement.querySelector('p:nth-of-type(2)')?.textContent?.trim();

                

                // Sprawdź, czy postać i rola pasują w ramach jednego roleElement
                if (
                    (!selectedCharacter || characterName === selectedCharacter) &&
                    (!selectedRole || characterRole === selectedRole)
                ) {
                    isVisible = true;
                }
            });

            // Pokaż lub ukryj drużynę na podstawie widoczności
            if (isVisible) {
                
                team.style.display = '';
            } else {
                
                team.style.display = 'none';
            }
        });
    }

    // Obsługa zmiany wyboru w filtrach
    characterFilter.addEventListener('change', filterTeams);
    roleFilter.addEventListener('change', filterTeams);

    // Wywołanie filtrowania po załadowaniu strony
    filterTeams();
	
	
	
	// Aktualizacja wyświetlania drużyn z uwzględnieniem duplikatów
    function updateTeamsDisplay() {
        const teamArticle = document.querySelector('article#teams-TEAMS.subtab-content');
        if (!teamArticle) return;

        const teams = teamArticle.querySelectorAll('.team');
        const teamHashes = new Set(); // Set do przechowywania hashy drużyn
        const duplicateTeams = new Set(); // Set do przechowywania duplikatów

        // Iterujemy po drużynach, by wykryć duplikaty
        teams.forEach(team => {
            const characterNameElements = team.querySelectorAll('p[data-character]');
            let characterNames = [];

            // Zbieramy imiona postaci w drużynie
            characterNameElements.forEach(element => {
                const characterId = element.getAttribute('data-character');
                characterNames.push(characterId);
            });

            // Generujemy unikalny hash dla drużyny (sortowanie imion postaci)
            const teamHash = characterNames.sort().join('-'); // Sortowanie, aby uwzględniało kolejność
            if (teamHashes.has(teamHash)) {
                duplicateTeams.add(team); // Jeśli drużyna już istnieje, to jest duplikatem
            } else {
                teamHashes.add(teamHash); // Dodajemy hash drużyny, jeśli nie było jeszcze duplikatu
            }
        });

        // Dodawanie czerwonego "X" do tytułów drużyn, które są duplikatami
        teams.forEach(team => {
            const teamTitle = team.querySelector('h3');
            if (duplicateTeams.has(team)) {
                if (!team.querySelector('.duplicate-mark')) {
                    const duplicateMark = document.createElement('span');
                    duplicateMark.textContent = 'duplicated team'; // Czerwony X
                    duplicateMark.classList.add('duplicate-mark');
                    duplicateMark.style.color = 'red';
                    teamTitle.appendChild(duplicateMark); // Dodajemy znak "X" do tytułu drużyny
                }
            } else {
                const existingMark = team.querySelector('.duplicate-mark');
                if (existingMark) {
                    existingMark.remove(); // Usuwamy znak "X" dla drużyn, które nie są duplikatami
                }
            }
        });
    }
	
	
	function updateTeamsDisplay() {
    const teams = document.querySelectorAll('.team'); // Drużyny w sekcji teams
    teams.forEach(team => {
        const characterNameElements = team.querySelectorAll('p[data-character]');
        let ownedCharacterCount = 0;

        // Iterujemy po wszystkich postaciach w drużynie
        characterNameElements.forEach(element => {
            const characterId = element.getAttribute('data-character');
            const isOwned = document.querySelector(`.owned-checkbox[data-character="${characterId}"]`)?.checked;

            // Zmiana stylu posiadanych postaci
            if (isOwned) {
                element.style.color = 'green';
                element.style.fontWeight = 'bold';
                ownedCharacterCount++;
            } else {
                element.style.color = '';
                element.style.fontWeight = '';
            }
        });

        // Zmiana koloru nazwy drużyny
        const teamTitle = team.querySelector('h3');
        if (teamTitle) {
            teamTitle.style.color = ownedCharacterCount === 4 ? 'green' : '';
        }
    });
}

// Obsługa zmiany stanu posiadanych postaci
document.querySelectorAll('.owned-checkbox').forEach(checkbox => {
    const characterId = checkbox.getAttribute('data-character');
    
    // Przy wczytywaniu ustaw stan checkboxa na podstawie localStorage
    checkbox.checked = localStorage.getItem(`owned_${characterId}`) === 'true';

    checkbox.addEventListener('change', () => {
        const isOwned = checkbox.checked;
        localStorage.setItem(`owned_${characterId}`, isOwned); // Zapis do localStorage
        updateTeamsDisplay(); // Aktualizuj wyświetlanie drużyn
    });
});

// Wywołanie funkcji przy ładowaniu strony
updateTeamsDisplay();


    // Wywołanie funkcji do aktualizacji wyświetlania drużyn po załadowaniu strony
    updateTeamsDisplay();
});