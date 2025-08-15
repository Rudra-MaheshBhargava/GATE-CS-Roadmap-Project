const subjectData = [
    { name: 'General Aptitude', weight: 15.36, tier: 1, insight: 'This is a guaranteed 15 marks. As you are already proficient, ensure you secure these marks with minimal revision.', topics: ['Verbal Ability', 'Numerical Ability', 'Quantitative Aptitude', 'Analytical Aptitude', 'Spatial Aptitude'] },
    { name: 'Programming & Data Structures', weight: 11.47, tier: 1, insight: 'Focus on C language nuances like Pointers, Recursion, and Static variables. These are classic areas for tricky questions.', topics: ['Programming in C (Pointers, Recursion)', 'Trees (BST, Heaps, AVL)', 'Graphs (Traversals, Representation)', 'Hashing', 'Stacks, Queues, Linked Lists'] },
    { name: 'Engineering & Discrete Maths', weight: 19.7, tier: 1, insight: 'This "Mathematics Block" is the single most important scoring area, consistently accounting for 23-28 marks. Master this block first.', topics: ['Linear Algebra (Matrices, Eigenvalues)', 'Probability & Statistics (Bayes\' Theorem)', 'Graph Theory (Connectivity, MST)', 'Mathematical Logic & Set Theory', 'Calculus (Limits, Maxima/Minima)'] },
    { name: 'Computer Org. & Architecture', weight: 10.24, tier: 1, insight: 'Master the numerical problems related to Cache Memory and Instruction Pipelining. They are the highest-scoring topics in COA.', topics: ['Memory Hierarchy (Cache Mapping)', 'Instruction Pipelining (Hazards, Speedup)', 'Machine Instructions & Addressing Modes'] },
    { name: 'Operating Systems', weight: 9.26, tier: 1, insight: 'CPU Scheduling and Process Synchronization are guaranteed sources of numerical and conceptual questions. Master them.', topics: ['CPU Scheduling Algorithms (Numerical)', 'Process Synchronization (Semaphores)', 'Deadlock (Banker\'s Algorithm)', 'Memory Management (Paging, Page Replacement)'] },
    { name: 'Computer Networks', weight: 8.85, tier: 1, insight: 'IP Addressing (Subnetting) is the single most critical topic in CN. Expect numerical questions on this in every paper.', topics: ['IP Addressing (Subnetting, CIDR)', 'Routing Protocols (Distance Vector, Link State)', 'TCP/UDP & Congestion Control', 'Data Link Layer (CRC, CSMA/CD)'] },
    { name: 'Theory of Computation', weight: 8.05, tier: 2, insight: 'Focus on Regular Expressions & Finite Automata. Mastering conversions between them can secure most marks from this subject.', topics: ['Regular Expressions & Finite Automata', 'Language Properties (Closure, Undecidability)'] },
    { name: 'Database Management Systems', weight: 7.94, tier: 2, insight: 'SQL queries and Normalization are guaranteed topics. A strong command over JOINs and calculating Normal Forms is essential.', topics: ['SQL Queries (especially JOINs)', 'Normalization (Functional Dependencies, BCNF)', 'Transactions & Concurrency Control', 'Indexing (B/B+ Trees)'] },
    { name: 'Algorithms', weight: 6.25, tier: 2, insight: 'Master Time Complexity analysis and the Master Theorem. It is the language of every algorithm question.', topics: ['Time & Space Complexity Analysis', 'Greedy Algorithms & Dynamic Programming', 'Graph Algorithms (Dijkstra\'s, MST)', 'Divide and Conquer'] },
    { name: 'Compiler Design', weight: 5.93, tier: 3, insight: 'Highly inefficient to study fully. Focus exclusively on calculating FIRST and FOLLOW sets and understanding LR parsers.', topics: ['Lexical Analysis & Parsing', 'FIRST and FOLLOW sets', 'LL(1) and LR Parsers'] },
    { name: 'Digital Logic', weight: 5.86, tier: 3, insight: 'Focus on K-Maps for quick and easy marks. It\'s the most reliable and simple topic in Digital Logic.', topics: ['Boolean Algebra & K-Maps', 'Combinational Circuits (Multiplexers, Decoders)'] },
];

document.addEventListener('DOMContentLoaded', () => {
    const sortedData = [...subjectData].sort((a, b) => b.weight - a.weight);

    const ctx = document.getElementById('weightageChart').getContext('2d');
    const weightageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(s => s.name),
            datasets: [{
                label: 'Average Weightage (%)',
                data: sortedData.map(s => s.weight),
                backgroundColor: sortedData.map(s => {
                    if (s.tier === 1) return 'rgba(224, 122, 95, 0.7)';
                    if (s.tier === 2) return 'rgba(61, 64, 91, 0.7)';
                    return 'rgba(129, 178, 154, 0.7)';
                }),
                borderColor: sortedData.map(s => {
                    if (s.tier === 1) return 'rgba(224, 122, 95, 1)';
                    if (s.tier === 2) return 'rgba(61, 64, 91, 1)';
                    return 'rgba(129, 178, 154, 1)';
                }),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `Weightage: ${c.raw.toFixed(2)}%` } } },
            scales: { x: { beginAtZero: true, title: { display: true, text: 'Weightage (%)' } }, y: { ticks: { autoSkip: false, font: { size: 10 } } } }
        }
    });

    const cardsContainer = document.getElementById('subject-cards');
    subjectData.forEach(subject => {
        const card = document.createElement('div');
        card.className = `p-4 bg-white rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 card-tier-${subject.tier}`;
        card.dataset.subject = subject.name;
        card.innerHTML = `<div class="flex justify-between items-start"><h4 class="font-semibold text-base">${subject.name}</h4><span class="text-lg font-bold text-gray-700">${subject.weight.toFixed(2)}%</span></div><p class="text-sm text-gray-500 mt-1">Tier ${subject.tier}</p>`;
        cardsContainer.appendChild(card);
    });

    const detailsTitle = document.getElementById('details-title');
    const detailsPlaceholder = document.getElementById('details-placeholder');
    const detailsContent = document.getElementById('details-content');
    const detailsInsight = document.getElementById('details-insight');
    const detailsTopics = document.getElementById('details-topics');
    const aiTopicSelect = document.getElementById('ai-topic-select');
    const aiExplainBtn = document.getElementById('ai-explain-btn');
    const aiQuestionBtn = document.getElementById('ai-question-btn');
    const aiResponseContainer = document.getElementById('ai-response-container');
    const aiResponseContent = document.getElementById('ai-response-content');
    const aiLoader = document.getElementById('ai-loader');
    let activeCard = null;

    cardsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('[data-subject]');
        if (!card) return;

        if (activeCard) activeCard.classList.remove('card-active');
        activeCard = card;
        activeCard.classList.add('card-active');

        const subjectName = card.dataset.subject;
        const data = subjectData.find(s => s.name === subjectName);

        detailsTitle.textContent = data.name;
        detailsInsight.textContent = data.insight;
        detailsTopics.innerHTML = data.topics.map(topic => `<li class="flex items-start"><span class="text-emerald-500 mr-2 mt-1">✓</span><span>${topic}</span></li>`).join('');
        
        aiTopicSelect.innerHTML = '<option value="">Select a topic to explore</option>';
        data.topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            aiTopicSelect.appendChild(option);
        });
        aiResponseContent.innerHTML = 'Select a topic and an action above.';
        
        detailsPlaceholder.classList.add('hidden');
        detailsContent.classList.remove('hidden');
    });
    
    async function callGeminiAPI(prompt, maxRetries = 3) {
        aiResponseContent.classList.add('hidden');
        aiLoader.style.display = 'flex';
        aiExplainBtn.disabled = true;
        aiQuestionBtn.disabled = true;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    aiResponseContent.innerHTML = text;
                    return; 
                } else {
                   throw new Error("Invalid response structure from API.");
                }
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) {
                    aiResponseContent.textContent = "Sorry, I couldn't fetch a response. Please check the console for errors and try again later.";
                } else {
                    await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
                }
            } finally {
                 if (i === maxRetries - 1) {
                    aiLoader.style.display = 'none';
                    aiResponseContent.classList.remove('hidden');
                    aiExplainBtn.disabled = false;
                    aiQuestionBtn.disabled = false;
                 }
            }
        }
    }

    aiExplainBtn.addEventListener('click', () => {
        const selectedTopic = aiTopicSelect.value;
        if (!selectedTopic) {
            aiResponseContent.textContent = "Please select a topic from the dropdown first.";
            return;
        }
        const prompt = `Provide a concise, easy-to-understand explanation for the GATE CS topic: '${selectedTopic}'. Start with a simple definition, then list 2-3 key concepts or sub-topics within it. Use an analogy if it helps clarify the concept. Format the output using simple HTML like <strong> for headings and <ul>/<li> for lists.`;
        callGeminiAPI(prompt);
    });

    aiQuestionBtn.addEventListener('click', () => {
        const selectedTopic = aiTopicSelect.value;
        if (!selectedTopic) {
            aiResponseContent.textContent = "Please select a topic from the dropdown first.";
            return;
        }
        const prompt = `Generate a GATE CS style multiple-choice question (MCQ) on the topic: '${selectedTopic}'. The question should be of medium difficulty. Provide four options (A, B, C, D). After the options, clearly state the correct answer and provide a step-by-step explanation for how to arrive at the solution. Format the output using simple HTML like <strong> for headings, <p> for the question/explanation, and <ul>/<li> for the options.`;
        callGeminiAPI(prompt);
    });

    const tabs = document.getElementById('tabs');
    const tabContents = {
        dashboard: document.getElementById('dashboard-content'),
        plan: document.getElementById('plan-content'),
        resources: document.getElementById('resources-content')
    };

    tabs.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        const tabName = e.target.dataset.tab;
        tabs.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('tab-active');
            btn.classList.add('tab-inactive');
        });
        e.target.classList.add('tab-active');
        e.target.classList.remove('tab-inactive');
        Object.values(tabContents).forEach(content => content.classList.add('hidden'));
        tabContents[tabName].classList.remove('hidden');
    });
});