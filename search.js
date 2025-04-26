// This code should be saved as search.js and linked to both HTML pages

// Load the course notes data
const courseNotesData = {
  course_notes: [
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-02-15",
      "notes-title": "Introduction to Calculus",
      "notes-body":
        "Today's lecture provided a comprehensive overview of limits and continuity, with particular emphasis on epsilon-delta definitions and their applications.",
    },
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-02-22",
      "notes-title": "Derivatives and Rules",
      "notes-body":
        "Today's lecture covered the power rule, product rule, quotient rule, and chain rule with several practical examples demonstrating their applications.",
    },
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-03-01",
      "notes-title": "Applications of Derivatives",
      "notes-body":
        "Professor Rahman explained how derivatives can be used to find maximum and minimum values, inflection points, and solve optimization problems in various fields.",
    },
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-03-08",
      "notes-title": "Integration Techniques",
      "notes-body":
        "Today we explored various integration methods including substitution, integration by parts, and partial fractions with numerous practice examples.",
    },
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-03-15",
      "notes-title": "Definite Integrals",
      "notes-body":
        "The lecture focused on the Fundamental Theorem of Calculus and applications of definite integrals in calculating areas and volumes.",
    },
    {
      "course-code": "MATH101",
      college: "SCIENCE",
      "date-added": "2025-03-22",
      "notes-title": "Series and Convergence",
      "notes-body":
        "Today's session on infinite series covered convergence tests including the ratio test, root test, and comparison tests with thorough explanations of when to apply each.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-01-23",
      "notes-title": "Data Structures",
      "notes-body":
        "Today's session on advanced tree structures was particularly challenging.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-01-30",
      "notes-title": "Hash Tables",
      "notes-body":
        "Professor Al-Mahmood presented collision resolution techniques for hash tables, with comparative analysis of chaining versus open addressing methods.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-02-06",
      "notes-title": "Graph Algorithms",
      "notes-body":
        "Today we covered breadth-first and depth-first search algorithms with implementations in Python and analysis of their time and space complexity.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-02-13",
      "notes-title": "Balanced Search Trees",
      "notes-body":
        "The lecture detailed the self-balancing mechanisms of AVL and Red-Black trees, with step-by-step illustrations of rotations during insertions and deletions.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-04-20",
      "notes-title": "Priority Queues",
      "notes-body":
        "Today's session focused on heap implementation of priority queues and the heap sort algorithm, with practical applications in scheduling systems.",
    },
    {
      "course-code": "CS250",
      college: "INFORMATION TECHNOLOGY",
      "date-added": "2025-02-27",
      "notes-title": "Advanced Sorting Algorithms",
      "notes-body":
        "Professor compared the performance characteristics of quicksort, mergesort, and heapsort with analysis of best-case, average-case, and worst-case scenarios.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-03-07",
      "notes-title": "Corporate Finance",
      "notes-body":
        "Professor Al-Khalifa delivered an in-depth analysis of capital budgeting techniques today, comparing NPV, IRR, and payback period methods.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-03-14",
      "notes-title": "Risk and Return",
      "notes-body":
        "Today's lecture explored the relationship between risk and return, covering the Capital Asset Pricing Model and its applications in portfolio management.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-03-21",
      "notes-title": "Cost of Capital",
      "notes-body":
        "Professor Al-Khalifa explained methods for calculating weighted average cost of capital (WACC) with practical examples from Gulf region companies.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-03-28",
      "notes-title": "Dividend Policy",
      "notes-body":
        "Today we analyzed how corporate dividend policies affect shareholder value and stock prices, examining various dividend theories and real-world practices.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-04-04",
      "notes-title": "Mergers and Acquisitions",
      "notes-body":
        "The lecture covered valuation methods for target companies in M&A transactions, with case studies of recent mergers in the banking sector.",
    },
    {
      "course-code": "BUS320",
      college: "BUSINESS ADMINISTRATION",
      "date-added": "2025-04-11",
      "notes-title": "International Financial Management",
      "notes-body":
        "Today's session focused on exchange rate risk management strategies and international capital budgeting considerations for multinational corporations.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-02-28",
      "notes-title": "Molecular Biology",
      "notes-body":
        "Today's lecture on gene regulation in eukaryotes was incredibly detailed.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-03-07",
      "notes-title": "DNA Replication",
      "notes-body":
        "Professor Al-Jishi provided an excellent explanation of the semi-conservative model of DNA replication and the key enzymes involved in the process.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-03-14",
      "notes-title": "Transcription",
      "notes-body":
        "Today's lecture detailed the three stages of transcription in eukaryotes, with emphasis on the role of RNA polymerase and transcription factors.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-03-21",
      "notes-title": "Translation",
      "notes-body":
        "We examined the process of protein synthesis from mRNA templates, covering the roles of ribosomes, tRNA, and the genetic code in translation.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-03-28",
      "notes-title": "Mutations and DNA Repair",
      "notes-body":
        "Today's session explored various types of DNA mutations and the cellular mechanisms that detect and repair damaged DNA to maintain genetic integrity.",
    },
    {
      "course-code": "BIO220",
      college: "SCIENCE",
      "date-added": "2025-04-04",
      "notes-title": "Recombinant DNA Technology",
      "notes-body":
        "Professor Al-Jishi demonstrated practical applications of gene cloning techniques and the use of restriction enzymes in biotechnology research.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-01-10",
      "notes-title": "International Law",
      "notes-body":
        "Professor Al-Dosari's lecture on the evolution of international humanitarian law was comprehensive, tracing its development from the Geneva Conventions through to modern interpretations in recent conflicts.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-01-17",
      "notes-title": "International Courts",
      "notes-body":
        "Today's lecture examined the jurisdiction and procedures of the International Court of Justice and International Criminal Court with analysis of landmark cases.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-01-24",
      "notes-title": "Law of the Sea",
      "notes-body":
        "Professor Al-Dosari explained the UN Convention on the Law of the Sea and its applications to territorial waters, exclusive economic zones, and freedom of navigation.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-01-31",
      "notes-title": "International Trade Law",
      "notes-body":
        "Today we analyzed the WTO dispute resolution mechanisms and their effectiveness in resolving international trade conflicts between member states.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-02-07",
      "notes-title": "Human Rights Law",
      "notes-body":
        "The lecture covered the International Bill of Human Rights and regional human rights conventions, with case studies on enforcement challenges.",
    },
    {
      "course-code": "LAW240",
      college: "LAW",
      "date-added": "2025-02-14",
      "notes-title": "Diplomatic Immunities",
      "notes-body":
        "Today's session detailed the Vienna Convention on Diplomatic Relations and the scope and limitations of diplomatic immunity in modern international relations.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-03-22",
      "notes-title": "Structural Analysis",
      "notes-body":
        "Today's session focused on matrix methods for analyzing indeterminate structures, particularly the direct stiffness method.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-03-29",
      "notes-title": "Beam Analysis",
      "notes-body":
        "Professor Al-Hashimi demonstrated the application of moment distribution method for continuous beams with various loading conditions and support configurations.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-04-05",
      "notes-title": "Influence Lines",
      "notes-body":
        "Today's lecture covered the construction and application of influence lines for determining critical loading positions on bridges and other structures.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-04-12",
      "notes-title": "Arches and Cables",
      "notes-body":
        "We examined the analysis of arch structures and cable systems under various loading conditions, with emphasis on their unique force distribution characteristics.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-04-19",
      "notes-title": "Plastic Analysis",
      "notes-body":
        "Today's session introduced methods for plastic analysis of steel structures and the concept of collapse mechanisms under ultimate loading conditions.",
    },
    {
      "course-code": "ENG330",
      college: "ENGINEERING",
      "date-added": "2025-04-26",
      "notes-title": "Computer Methods",
      "notes-body":
        "Professor Al-Hashimi demonstrated practical applications of finite element analysis software for solving complex structural engineering problems.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-02-05",
      "notes-title": "Contemporary Middle Eastern Art",
      "notes-body":
        "Professor Malallah delivered a fascinating lecture on the transformation of calligraphy in contemporary Middle Eastern art movements.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-02-12",
      "notes-title": "Political Art",
      "notes-body":
        "Today's lecture explored how contemporary Middle Eastern artists address political conflicts and social issues through their artistic expression.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-02-19",
      "notes-title": "Installation Art",
      "notes-body":
        "Professor Malallah analyzed the emergence of installation art in the Gulf region and its connections to traditional cultural elements and modern concerns.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-02-26",
      "notes-title": "Video and Digital Art",
      "notes-body":
        "Today we examined the growing influence of digital media in Middle Eastern contemporary art, with case studies of pioneering video artists from the region.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-03-05",
      "notes-title": "Women Artists",
      "notes-body":
        "The lecture highlighted the contributions of female artists to contemporary Middle Eastern art and their unique perspectives on gender and identity.",
    },
    {
      "course-code": "ART250",
      college: "ARTS",
      "date-added": "2025-03-12",
      "notes-title": "Art Market Dynamics",
      "notes-body":
        "Today's session analyzed the evolution of art markets in the Middle East, including the impact of international art fairs and the establishment of major museums.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-04-12",
      "notes-title": "Sports Biomechanics",
      "notes-body":
        "Today's lecture on kinetic chain analysis in athletic performance was extremely detailed and technical.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-04-19",
      "notes-title": "Gait Analysis",
      "notes-body":
        "Professor Al-Mansoori demonstrated advanced techniques for quantitative gait analysis using motion capture technology and force platforms.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-04-26",
      "notes-title": "Injury Biomechanics",
      "notes-body":
        "Today's lecture explored the biomechanical factors contributing to common sports injuries and evidence-based approaches to prevention strategies.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-05-03",
      "notes-title": "Swimming Mechanics",
      "notes-body":
        "We analyzed the fluid dynamics principles underlying different swimming strokes and techniques for optimizing propulsion while minimizing drag forces.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-05-10",
      "notes-title": "Equipment Design",
      "notes-body":
        "Today's session examined how biomechanical principles are applied in the design and evaluation of sports equipment to enhance performance and safety.",
    },
    {
      "course-code": "HSS420",
      college: "COLLEGE OF HEALTH AND SPORT SCIENCES",
      "date-added": "2025-05-17",
      "notes-title": "Performance Optimization",
      "notes-body":
        "Professor Al-Mansoori presented case studies of biomechanical interventions that significantly improved elite athletes' performance through technique modifications.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-03-30",
      "notes-title": "Educational Assessment",
      "notes-body":
        "Professor Al-Zayani's lecture on formative assessment strategies provided valuable practical techniques for classroom implementation.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-04-06",
      "notes-title": "Summative Assessment Design",
      "notes-body":
        "Today's lecture covered principles for designing valid and reliable summative assessments that align with learning objectives and curriculum standards.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-04-13",
      "notes-title": "Authentic Assessment",
      "notes-body":
        "Professor Al-Zayani demonstrated various authentic assessment techniques that evaluate students' abilities to apply knowledge in real-world contexts.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-04-20",
      "notes-title": "Assessment Feedback",
      "notes-body":
        "Today we explored research-based approaches to providing effective feedback that promotes student growth and motivates continuous improvement.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-04-27",
      "notes-title": "Digital Assessment Tools",
      "notes-body":
        "The lecture showcased innovative digital tools and platforms for streamlining assessment processes and enhancing data analysis for instructional decision-making.",
    },
    {
      "course-code": "EDU305",
      college: "BAHRAIN TEACHERS COLLEGE",
      "date-added": "2025-05-04",
      "notes-title": "Inclusive Assessment",
      "notes-body":
        "Today's session focused on designing and implementing assessment accommodations for diverse learners while maintaining academic standards and expectations.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-01-18",
      "notes-title": "Project Management",
      "notes-body":
        "Today's session on agile project management methodologies was incredibly relevant to current industry practices.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-01-25",
      "notes-title": "Risk Management",
      "notes-body":
        "Professor Al-Abbasi presented comprehensive frameworks for identifying, analyzing, and responding to project risks with practical examples from local industries.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-02-01",
      "notes-title": "Stakeholder Management",
      "notes-body":
        "Today's lecture focused on strategies for effective stakeholder analysis, engagement, and communication throughout the project lifecycle.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-02-08",
      "notes-title": "Project Scheduling",
      "notes-body":
        "We examined advanced scheduling techniques including critical path method, PERT, and resource leveling with hands-on practice using project management software.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-02-15",
      "notes-title": "Cost Management",
      "notes-body":
        "Today's session covered earned value management techniques for tracking project performance and forecasting final costs based on current progress metrics.",
    },
    {
      "course-code": "APS280",
      college: "APPLIED STUDIES",
      "date-added": "2025-02-22",
      "notes-title": "Project Leadership",
      "notes-body":
        "Professor Al-Abbasi discussed leadership styles and conflict resolution strategies that contribute to successful project team management and organizational change.",
    },
  ],
};
// Function to initialize the search form
function initSearchForm() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get search criteria
      const courseCode = document
        .getElementById("course-code")
        .value.trim()
        .toUpperCase();
      const college = document.getElementById("college").value;
      const dateFilter = document.getElementById("date").value;

      // Store search criteria in sessionStorage
      sessionStorage.setItem("searchCourseCode", courseCode);
      sessionStorage.setItem("searchCollege", college);
      sessionStorage.setItem("searchDateFilter", dateFilter);

      // Redirect to search results page
      window.location.href = "Search-results.html";
    });
  }
}

// Function to load search results
function loadSearchResults() {
  const searchResultsDiv = document.getElementById("search-results");
  if (!searchResultsDiv) return;

  // Get search criteria from sessionStorage
  const courseCode = sessionStorage.getItem("searchCourseCode") || "";
  const college = sessionStorage.getItem("searchCollege") || "";
  const dateFilter = sessionStorage.getItem("searchDateFilter") || "";

  // Filter the data
  let filteredResults = courseNotesData.course_notes.filter((note) => {
    // Filter by course code
    if (courseCode && !note["course-code"].includes(courseCode)) {
      return false;
    }

    // Filter by college
    if (college) {
      const collegeValue = getCollegeValue(college);
      if (!note.college.includes(collegeValue)) {
        return false;
      }
    }

    // Filter by date
    if (dateFilter) {
      const noteDate = new Date(note["date-added"]);
      const today = new Date();

      if (dateFilter === "today") {
        if (noteDate.toDateString() !== today.toDateString()) {
          return false;
        }
      } else if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        if (noteDate < oneWeekAgo) {
          return false;
        }
      } else if (dateFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        if (noteDate < oneMonthAgo) {
          return false;
        }
      } else if (dateFilter === "year") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        if (noteDate < oneYearAgo) {
          return false;
        }
      }
    }

    return true;
  });

  // Update results count
  const resultsCountElement = document.getElementById("results-count");
  if (resultsCountElement) {
    resultsCountElement.textContent = `${filteredResults.length} results found`;
  }

  // Clear existing results except the header
  const headerDiv = document.querySelector(".results-header");

  // Keep the header and clear everything after it
  if (headerDiv && headerDiv.nextSibling) {
    // Remove all elements after the header
    while (headerDiv.nextSibling) {
      searchResultsDiv.removeChild(headerDiv.nextSibling);
    }
  }

  // Populate results
  if (filteredResults.length === 0) {
    const noResultsDiv = document.createElement("div");
    noResultsDiv.className = "no-results";
    noResultsDiv.textContent =
      "No results found. Try adjusting your search criteria.";
    searchResultsDiv.appendChild(noResultsDiv);
  } else {
    filteredResults.forEach((note) => {
      // Create result item exactly as specified
      const resultItem = document.createElement("div");
      resultItem.id = "result-item";
      resultItem.className = "result-item";

      const resultTitle = document.createElement("div");
      resultTitle.id = "result-title";
      resultTitle.className = "result-title";
      resultTitle.textContent = `${note["notes-title"]}`;

      const resultMeta = document.createElement("div");
      resultMeta.id = "result-meta";
      resultMeta.className = "result-meta";

      // Format date for display
      const dateAdded = new Date(note["date-added"]);
      const formattedDate = dateAdded.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      resultMeta.textContent = `${note.college} • Added on ${formattedDate}`;

      resultItem.appendChild(resultTitle);
      resultItem.appendChild(resultMeta);

      // Add click event to show note details
      resultItem.addEventListener("click", function () {
        sessionStorage.setItem("selectedNote", JSON.stringify(note));
        // Redirect to a note details page or show in a modal
        // For now, just alert the note content
        alert(`${note["notes-title"]}\n\n${note["notes-body"]}`);
      });

      searchResultsDiv.appendChild(resultItem);
    });

    // Add pagination if there are more than 5 results
    if (filteredResults.length > 5) {
      const paginationDiv = document.createElement("div");
      paginationDiv.className = "pagination";

      const prevButton = document.createElement("button");
      prevButton.className = "pagination-button";
      prevButton.textContent = "«";

      const page1Button = document.createElement("button");
      page1Button.className = "pagination-button active";
      page1Button.textContent = "1";

      const page2Button = document.createElement("button");
      page2Button.className = "pagination-button";
      page2Button.textContent = "2";

      const nextButton = document.createElement("button");
      nextButton.className = "pagination-button";
      nextButton.textContent = "»";

      paginationDiv.appendChild(prevButton);
      paginationDiv.appendChild(page1Button);
      paginationDiv.appendChild(page2Button);
      paginationDiv.appendChild(nextButton);

      searchResultsDiv.appendChild(paginationDiv);
    }
  }
}

// Helper function to convert college dropdown value to actual college name
function getCollegeValue(collegeValue) {
  const collegeMap = {
    applied_studies: "APPLIED STUDIES",
    arts: "ARTS",
    teachers: "BAHRAIN TEACHERS COLLEGE",
    business: "BUSINESS ADMINISTRATION",
    engineering: "ENGINEERING",
    health: "COLLEGE OF HEALTH AND SPORT SCIENCES",
    it: "INFORMATION TECHNOLOGY",
    law: "LAW",
    science: "SCIENCE",
  };

  return collegeMap[collegeValue] || "";
}

// Function to handle the clear button
function initClearButton() {
  const clearButton = document.querySelector(
    '#search-form button[type="submit"]:nth-of-type(2)'
  );
  if (clearButton) {
    clearButton.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("course-code").value = "";
      document.getElementById("college").value = "";
      document.getElementById("date").value = "";
    });
  }
}

// Initialize based on the current page
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("index4.html")) {
    initSearchForm();
    initClearButton();
  } else if (window.location.href.includes("Search-results.html")) {
    loadSearchResults();
  }
});
