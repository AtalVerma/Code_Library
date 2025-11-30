// Sample snippets data
let snippets = [];

// Get current logged-in user's email
function getCurrentUserEmail() {
    return localStorage.getItem('userEmail') || 'guest';
}

// Initialize snippets from localStorage or use default data
function initializeSnippets() {
    console.log('Initializing snippets...');
    const userEmail = getCurrentUserEmail();
    const storageKey = 'codeSnippets_' + userEmail;
    const savedSnippets = localStorage.getItem(storageKey);
    
    if (savedSnippets) {
        snippets = JSON.parse(savedSnippets);
        console.log('Loaded ' + snippets.length + ' snippets from localStorage for ' + userEmail);
    } else {
        console.log('No saved snippets for ' + userEmail + ', using defaults');
        // Default snippets - only for first-time users
        snippets = [
            {
                id: 1,
                title: "Array Map Function",
                language: "JavaScript",
                description: "Transform array elements using map",
                code: "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled); // [2, 4, 6, 8]",
                date: "2024-01-15"
            },
            {
                id: 2,
                title: "List Comprehension",
                language: "Python",
                description: "Create a list of squares",
                code: "numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(squares)  # [1, 4, 9, 16, 25]",
                date: "2024-01-14"
            },
            {
                id: 3,
                title: "Swap Two Numbers",
                language: "C",
                description: "Swap values without temp variable",
                code: "int a = 5, b = 10;\na = a + b;\nb = a - b;\na = a - b;\nprintf(\"a=%d, b=%d\", a, b);",
                date: "2024-01-13"
            },
            {
                id: 4,
                title: "Vector Sorting",
                language: "C++",
                description: "Sort a vector in ascending order",
                code: "#include <algorithm>\n#include <vector>\n\nvector<int> nums = {5, 2, 8, 1};\nsort(nums.begin(), nums.end());",
                date: "2024-01-12"
            },
            {
                id: 5,
                title: "Flexbox Center",
                language: "HTML/CSS",
                description: "Center elements using flexbox",
                code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}",
                date: "2024-01-11"
            },
            {
                id: 6,
                title: "Fetch API Call",
                language: "JavaScript",
                description: "Make an HTTP GET request",
                code: "fetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));",
                date: "2024-01-10"
            }
        ];
        // Save default snippets to localStorage
        saveSnippets();
    }
}

// Save snippets to localStorage (per user)
function saveSnippets() {
    const userEmail = getCurrentUserEmail();
    const storageKey = 'codeSnippets_' + userEmail;
    localStorage.setItem(storageKey, JSON.stringify(snippets));
    console.log('Saved ' + snippets.length + ' snippets to localStorage for ' + userEmail);
}

// Initialize on load
if (snippets.length === 0) {
    initializeSnippets();
}

// Load snippets to grid
function loadSnippets() {
    // Make sure snippets are initialized
    if (snippets.length === 0) {
        initializeSnippets();
    }
    
    const grid = document.getElementById('snippetsGrid');
    
    if (!grid) {
        console.error('Snippets grid not found!');
        return;
    }
    
    const searchInput = document.getElementById('searchInput');
    const langFilter = document.getElementById('languageFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const langFilterValue = langFilter ? langFilter.value : 'all';

    let filtered = snippets.filter(snippet => {
        const matchesSearch = snippet.title.toLowerCase().includes(searchTerm) ||
                            snippet.description.toLowerCase().includes(searchTerm);
        const matchesLang = langFilterValue === 'all' || snippet.language === langFilterValue;
        return matchesSearch && matchesLang;
    });

    grid.innerHTML = filtered.map(snippet => `
        <div class="snippet-card">
            <div class="snippet-header">
                <div class="snippet-title">${snippet.title}</div>
                <div class="snippet-lang">${snippet.language}</div>
            </div>
            <div class="snippet-desc">${snippet.description}</div>
            <div class="snippet-code">${escapeHtml(snippet.code)}</div>
            <div class="snippet-footer">
                <span>📅 ${snippet.date}</span>
                <button class="copy-btn" onclick="copyCode(${snippet.id})">📋 Copy</button>
                <button class="edit-btn" onclick="editSnippet(${snippet.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteSnippet(${snippet.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
    
    console.log('Loaded ' + filtered.length + ' snippets to grid');
}

// Filter snippets
function filterSnippets() {
    loadSnippets();
}

// Copy code to clipboard
function copyCode(id) {
    const snippet = snippets.find(s => s.id === id);
    navigator.clipboard.writeText(snippet.code).then(() => {
        alert('Code copied to clipboard!');
    });
}

// Add new snippet
function addSnippet(event) {
    event.preventDefault();

    const newSnippet = {
        id: Date.now(), // Use timestamp for unique ID
        title: document.getElementById('snippetTitle').value,
        language: document.getElementById('snippetLanguage').value,
        description: document.getElementById('snippetDesc').value,
        code: document.getElementById('snippetCode').value,
        date: new Date().toISOString().split('T')[0]
    };

    snippets.unshift(newSnippet);
    saveSnippets(); // Save to localStorage
    alert('Snippet added successfully!');
    event.target.reset();
    
    // Redirect to library page
    window.location.href = 'LibraryPage.html';
}

// Escape HTML for code display
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Delete snippet
function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet?')) {
        snippets = snippets.filter(snippet => snippet.id !== id);
        saveSnippets();
        loadSnippets();
        alert('Snippet deleted successfully!');
    }
}

// Edit snippet - Redirect to snippet page with edit parameter
function editSnippet(id) {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) {
        alert('Snippet not found!');
        return;
    }
    
    // Redirect to snippet page with edit mode
    window.location.href = 'snippetPage.html?edit=' + id;
}

// Load snippet data for editing (called from snippetPage.html)
function loadSnippetForEdit(id) {
    // Make sure snippets are initialized
    if (snippets.length === 0) {
        initializeSnippets();
    }
    
    const snippet = snippets.find(s => s.id === id);
    
    if (!snippet) {
        alert('Snippet not found!');
        window.location.href = 'LibraryPage.html';
        return;
    }
    
    // Update form title and button
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    if (formTitle) formTitle.textContent = 'Edit Snippet';
    if (submitBtn) submitBtn.textContent = 'Update Snippet';
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
    
    // Fill form with snippet data
    document.getElementById('snippetTitle').value = snippet.title;
    document.getElementById('snippetLanguage').value = snippet.language;
    document.getElementById('snippetDesc').value = snippet.description;
    document.getElementById('snippetCode').value = snippet.code;
}

// Update existing snippet
function updateSnippet(id) {
    // Make sure snippets are initialized
    if (snippets.length === 0) {
        initializeSnippets();
    }
    
    const snippetIndex = snippets.findIndex(s => s.id === id);
    
    if (snippetIndex === -1) {
        alert('Snippet not found!');
        return;
    }
    
    // Update snippet with new values
    snippets[snippetIndex] = {
        id: id,
        title: document.getElementById('snippetTitle').value,
        language: document.getElementById('snippetLanguage').value,
        description: document.getElementById('snippetDesc').value,
        code: document.getElementById('snippetCode').value,
        date: snippets[snippetIndex].date  // Keep original date
    };
    
    saveSnippets();
    alert('Snippet updated successfully!');
    window.location.href = 'LibraryPage.html';
}

// Handle form submission (both add and edit)
function handleSnippetSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const editId = form.dataset.editId;
    
    if (editId) {
        updateSnippet(parseInt(editId));  // Edit mode
    } else {
        addSnippet(event);                 // Add mode
    }
}

// Cancel edit and go back
function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Any changes will be lost.')) {
        window.location.href = 'LibraryPage.html';
    }
}