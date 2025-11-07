
document.addEventListener("DOMContentLoaded", () => {
  // --- SIGN UP ---
  if (document.getElementById("signupForm")) {
    document.getElementById("signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value;

      const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
      if (!passRegex.test(password)) {
        alert("Password must include 1 uppercase, 1 number, 1 special symbol, and be at least 6 characters.");
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        return;
      }

      const user = { name, email, phone, password };
      localStorage.setItem("wanderlustUser", JSON.stringify(user));
      alert("Sign-up successful! Please login now.");
      window.location.href = "login.html";
    });
  }

  // --- LOGIN ---
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      // support both earlier id names (some HTML used loginUser/loginPassword vs loginEmail/loginPassword)
      const loginUserEl = document.getElementById("loginUser") || document.getElementById("loginEmail");
      const email = loginUserEl ? loginUserEl.value.trim() : "";
      const password = document.getElementById("loginPassword").value;
      const storedUser = JSON.parse(localStorage.getItem("wanderlustUser"));

      if (storedUser && (email === storedUser.email || email === storedUser.name) && password === storedUser.password) {
        alert("Login successful!");
        // send to details page (you used details.html previously)
        window.location.href = "details.html";
      } else {
        alert("Invalid credentials!");
      }
    });
  }

  // --- DETAILS ---
  if (document.getElementById("detailsForm")) {
    document.getElementById("detailsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const country = document.getElementById("country").value.trim();
      const city = document.getElementById("city").value.trim();
      const favplace = document.getElementById("favplace").value.trim();

      const user = JSON.parse(localStorage.getItem("wanderlustUser")) || {};
      user.country = country;
      user.city = city;
      user.favplace = favplace;
      localStorage.setItem("wanderlustUser", JSON.stringify(user));

      alert("Profile completed successfully!");
      window.location.href = "home.html";
    });
  }

  // --- DASHBOARD PROFILE PANEL ---
  if (document.getElementById("profilePanel")) {
    let user = JSON.parse(localStorage.getItem("wanderlustUser")) || {};
    const profileIcon = document.getElementById("profileIcon");
    const panel = document.getElementById("profilePanel");

    if (profileIcon) profileIcon.src = user.avatar || "https://i.pravatar.cc/60?img=5";

    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        panel.classList.toggle("active");
        showMainOptions();
        populateProfileDetails();
      });
    }

    // Function to populate user details
    function populateProfileDetails() {
      const user = JSON.parse(localStorage.getItem("wanderlustUser")) || {};

      if (document.getElementById("editName")) document.getElementById("editName").value = user.name || "";
      if (document.getElementById("editEmail")) document.getElementById("editEmail").value = user.email || "";
      if (document.getElementById("editPhone")) document.getElementById("editPhone").value = user.phone || "";
      if (document.getElementById("editCountry")) document.getElementById("editCountry").value = user.country || "";
      if (document.getElementById("editCity")) document.getElementById("editCity").value = user.city || "";
      if (document.getElementById("editFav")) document.getElementById("editFav").value = user.favplace || "";

      // Optional: update avatar in panel if you have an img element
      const panelAvatar = document.getElementById("panelAvatar");
      if (panelAvatar) panelAvatar.src = user.avatar || "https://i.pravatar.cc/60?img=5";
    }

    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== profileIcon) {
        panel.classList.remove("active");
        showMainOptions();
      }
    });

    // Buttons (only wire if elements exist)
    if (document.getElementById("avatarBtn")) document.getElementById("avatarBtn").addEventListener("click", () => toggleSection("avatarSection"));
    if (document.getElementById("updateBtn")) document.getElementById("updateBtn").addEventListener("click", () => toggleSection("updateSection"));
    if (document.getElementById("passwordBtn")) document.getElementById("passwordBtn").addEventListener("click", () => toggleSection("passwordSection"));

    // Back buttons
    document.querySelectorAll(".back-btn").forEach(btn => {
      btn.addEventListener("click", showMainOptions);
    });

    // Avatar change
    document.querySelectorAll(".avatar-option").forEach(img => {
      img.addEventListener("click", () => {
        if (!profileIcon) return;
        profileIcon.src = img.src;
        user.avatar = img.src;
        localStorage.setItem("wanderlustUser", JSON.stringify(user));
        alert("Avatar updated!");
      });
    });

    // Update Profile
    if (document.getElementById("updateProfileForm")) {
      document.getElementById("updateProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        user.name = document.getElementById("editName").value;
        user.email = document.getElementById("editEmail").value;
        user.phone = document.getElementById("editPhone").value;
        user.country = document.getElementById("editCountry").value;
        user.city = document.getElementById("editCity").value;
        user.favplace = document.getElementById("editFav").value;
        localStorage.setItem("wanderlustUser", JSON.stringify(user));
        alert("Profile updated successfully!");
        showMainOptions();
      });
    }

    // Change Password
    if (document.getElementById("changePasswordForm")) {
      document.getElementById("changePasswordForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const current = document.getElementById("currentPassword").value;
        const newPass = document.getElementById("newPassword").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (current !== user.password) return alert("Current password incorrect!");
        if (newPass !== confirm) return alert("Passwords do not match!");
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!passRegex.test(newPass)) return alert("Password too weak!");

        user.password = newPass;
        localStorage.setItem("wanderlustUser", JSON.stringify(user));
        alert("Password updated successfully!");
        showMainOptions();
      });
    }

    // Logout + Delete
    if (document.getElementById("logoutBtn")) {
      document.getElementById("logoutBtn").addEventListener("click", () => {
        alert("Logged out successfully!");
        window.location.href = "login.html";
      });
    }
    if (document.getElementById("deleteBtn")) {
      document.getElementById("deleteBtn").addEventListener("click", () => {
        localStorage.removeItem("wanderlustUser");
        alert("Account deleted!");
        window.location.href = "signup.html";
      });
    }

    function showMainOptions() {
      if (document.getElementById("mainOptions")) document.getElementById("mainOptions").classList.remove("hidden");
      ["avatarSection", "updateSection", "passwordSection"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
    }

    function toggleSection(id) {
      if (document.getElementById("mainOptions")) document.getElementById("mainOptions").classList.add("hidden");
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    }
  } // end profilePanel block

  // --- DASHBOARD / EXPLORE / MY TRIPS --- //

  // Elements (safe access)
  const homeTab = document.getElementById("homeTab");
  const exploreTab = document.getElementById("exploreTab");
  const myTripsTab = document.getElementById("myTripsTab");
  const exploreSection = document.getElementById("exploreSection");
  const myTripsSection = document.getElementById("myTripsSection");
  const homeSection = document.querySelector(".dashboard-content"); // your main content area
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // If elements exist, wire tab behavior (defensive)
  if (homeTab) {
    homeTab.addEventListener("click", () => {
      if (exploreSection) exploreSection.classList.add("hidden");
      if (myTripsSection) myTripsSection.classList.add("hidden");
      if (homeSection) {
        // restore welcome text (assuming the dashboard-content h2/p exist)
        const h2 = homeSection.querySelector("h2");
        const p = homeSection.querySelector("p");
        if (h2) h2.textContent = "Welcome";
        if (p) p.textContent = "Your dream journeys await. Explore and plan your trips!";
      }
    });
  }

  if (exploreTab) {
    exploreTab.addEventListener("click", () => {
      if (exploreSection) exploreSection.classList.remove("hidden");
      if (myTripsSection) myTripsSection.classList.add("hidden");
      if (homeSection) {
        const h2 = homeSection.querySelector("h2");
        const p = homeSection.querySelector("p");
        if (h2) h2.textContent = "Explore Destinations";
        if (p) p.textContent = "";
      }
    });
  }

  if (myTripsTab) {
    myTripsTab.addEventListener("click", () => {
      if (exploreSection) exploreSection.classList.add("hidden");
      if (myTripsSection) myTripsSection.classList.remove("hidden");
      if (homeSection) {
        const h2 = homeSection.querySelector("h2");
        const p = homeSection.querySelector("p");
        if (h2) h2.textContent = "My Trips";
        if (p) p.textContent = "Your saved and planned trips.";
      }
      showMyTrips();
    });
  }
  // --- BOOKINGS TAB ---
  const bookingsTab = document.getElementById("bookingsTab");
  if (bookingsTab) {
    bookingsTab.addEventListener("click", () => {
      // You can replace these URLs with any booking portals you want
      const travelOptions = `
        <h2>Book Your Travel</h2>
        <p>Select your mode of travel below:</p>
        <ul>
          <li><a href="https://www.google.com/travel/flights" target="_blank">✈️ Google Flights</a></li>
          <li><a href="https://www.irctc.co.in/nget/train-search" target="_blank">🚆 IRCTC Train Booking</a></li>
          <li><a href="https://www.redbus.in/" target="_blank">🚌 RedBus Bus Tickets</a></li>
          <li><a href="https://www.makemytrip.com/" target="_blank">🏨 MakeMyTrip (Hotels & Packages)</a></li>
        </ul>
      `;

      if (exploreSection) exploreSection.classList.add("hidden");
      if (myTripsSection) myTripsSection.classList.add("hidden");
      const h2 = homeSection.querySelector("h2");
      const p = homeSection.querySelector("p");
      if (h2) h2.textContent = "";
      if (p) p.innerHTML = travelOptions;
    });
  }

  // === DESTINATIONS DATA ===
  // Add more states later as needed; keys are lowercased without extra spaces
  const destinations = {
    goa: [
  {
    name: "Baga Beach",
    description: "Popular beach with lively shacks, watersports and nightlife.",
    map: "https://www.google.com/maps/place/Baga+Beach,+Goa",
    hotels: [
      { name: "Taj Exotica Resort", map: "https://www.google.com/maps/search/Taj+Exotica+Goa" },
      { name: "Hard Rock Hotel Goa", map: "https://www.google.com/maps/search/Hard+Rock+Hotel+Goa" },
      { name: "Resort Rio", map: "https://www.google.com/maps/search/Resort+Rio+Goa" }
    ]
  },
  {
    name: "Calangute Beach",
    description: "Large popular beach near Baga with shopping and beach activities.",
    map: "https://www.google.com/maps/place/Calangute+Beach,+Goa",
    hotels: [
      { name: "Baywatch Resort", map: "https://www.google.com/maps/search/Baywatch+Resort+Calangute" },
      { name: "Club Mahindra", map: "https://www.google.com/maps/search/Club+Mahindra+Calangute" }
    ]
  },
  {
    name: "Dudhsagar Falls",
    description: "Tall multi-tiered waterfall on the Goa–Karnataka border (monsoon spectacular).",
    map: "https://www.google.com/maps/place/Dudhsagar+Falls",
    hotels: [
      { name: "Dudhsagar Forest Cabins", map: "https://www.google.com/maps/search/Dudhsagar+Forest+Cabins" },
      { name: "Nearby resort search", map: "https://www.google.com/maps/search/resorts+near+Dudhsagar+Falls" }
    ]
  },
  {
    name: "Basilica of Bom Jesus",
    description: "UNESCO site and historic church in Old Goa.",
    map: "https://www.google.com/maps/place/Basilica+of+Bom+Jesus,+Old+Goa",
    hotels: [
      { name: "Goa Marriott Resort", map: "https://www.google.com/maps/search/Goa+Marriott+Resort" },
      { name: "Cidade de Goa", map: "https://www.google.com/maps/search/Cidade+de+Goa" }
    ]
  },
  {
    name: "Anjuna Beach & Flea Market",
    description: "Famous for the flea market, beach parties and bohemian vibe.",
    map: "https://www.google.com/maps/place/Anjuna+Beach,+Goa",
    hotels: [
      { name: "W Goa (Vagator)", map: "https://www.google.com/maps/search/W+Goa+Vagator" },
      { name: "Navtara Beach Resort", map: "https://www.google.com/maps/search/Navtara+Resort+Anjuna" }
    ]
  },
  {
    name: "Chapora Fort",
    description: "Historic fort with panoramic views over Vagator Beach.",
    map: "https://www.google.com/maps/place/Chapora+Fort",
    hotels: [
      { name: "La Sunila Suites (nearby)", map: "https://www.google.com/maps/search/hotels+near+Chapora+Fort" }
    ]
  },
  {
    name: "Mollem National Park",
    description: "Forest and wildlife area — gateway to Dudhsagar and wildlife treks.",
    map: "https://www.google.com/maps/place/Molem+National+Park",
    hotels: [
      { name: "Mollem Guest Houses", map: "https://www.google.com/maps/search/guest+houses+near+Mollem" }
    ]
  }
],
kerala: [
  {
    name: "Munnar",
    description: "Famous hill station known for tea plantations, misty mountains, and Eravikulam National Park.",
    map: "https://www.google.com/maps/place/Munnar,+Kerala",
    hotels: [
      { name: "Tea County Munnar", map: "https://www.google.com/maps/search/Tea+County+Munnar" },
      { name: "Parakkat Nature Resort", map: "https://www.google.com/maps/search/Parakkat+Nature+Resort+Munnar" },
      { name: "Amber Dale Luxury Hotel", map: "https://www.google.com/maps/search/Amber+Dale+Luxury+Hotel+Munnar" }
    ]
  },
  {
    name: "Alleppey Backwaters",
    description: "Famous for tranquil backwaters, houseboat cruises, and paddy fields.",
    map: "https://www.google.com/maps/place/Alleppey,+Kerala",
    hotels: [
      { name: "Lake Palace Resort", map: "https://www.google.com/maps/search/Lake+Palace+Resort+Alleppey" },
      { name: "Ramada by Wyndham Alleppey", map: "https://www.google.com/maps/search/Ramada+by+Wyndham+Alleppey" },
      { name: "Houseboat Stays", map: "https://www.google.com/maps/search/houseboats+in+Alleppey" }
    ]
  },
  {
    name: "Kovalam Beach",
    description: "Crescent-shaped beach famous for sunbathing, surfing, and ayurvedic centers.",
    map: "https://www.google.com/maps/place/Kovalam+Beach,+Kerala",
    hotels: [
      { name: "The Leela Kovalam", map: "https://www.google.com/maps/search/The+Leela+Kovalam" },
      { name: "Uday Samudra Leisure Beach Hotel", map: "https://www.google.com/maps/search/Uday+Samudra+Kovalam" }
    ]
  },
  {
    name: "Athirappilly Waterfalls",
    description: "Largest waterfall in Kerala, often called the Niagara of India.",
    map: "https://www.google.com/maps/place/Athirappilly+Waterfalls",
    hotels: [
      { name: "Rainforest Resort Athirappilly", map: "https://www.google.com/maps/search/Rainforest+Resort+Athirappilly" },
      { name: "Hydel Palace", map: "https://www.google.com/maps/search/Hydel+Palace+Athirappilly" }
    ]
  },
  {
    name: "Wayanad",
    description: "Hill district known for forests, waterfalls, and Edakkal Caves.",
    map: "https://www.google.com/maps/place/Wayanad,+Kerala",
    hotels: [
      { name: "Vythiri Village Resort", map: "https://www.google.com/maps/search/Vythiri+Village+Resort" },
      { name: "Sterling Wayanad", map: "https://www.google.com/maps/search/Sterling+Wayanad" }
    ]
  },
  {
    name: "Sabarimala Temple",
    description: "Sacred pilgrimage site dedicated to Lord Ayyappa, visited by millions.",
    map: "https://www.google.com/maps/place/Sabarimala+Temple",
    hotels: [
      { name: "KTDC Hotel Periyar", map: "https://www.google.com/maps/search/KTDC+Hotel+Periyar" },
      { name: "Hotel Hill View Pathanamthitta", map: "https://www.google.com/maps/search/Hotel+Hill+View+Pathanamthitta" }
    ]
  },
  {
    name: "Varkala Cliff Beach",
    description: "Cliffside beach with natural springs, cafes, and scenic sunset points.",
    map: "https://www.google.com/maps/place/Varkala+Beach,+Kerala",
    hotels: [
      { name: "Clafouti Beach Resort", map: "https://www.google.com/maps/search/Clafouti+Beach+Resort" },
      { name: "Hindustan Beach Retreat", map: "https://www.google.com/maps/search/Hindustan+Beach+Retreat+Varkala" }
    ]
  }
],
karnataka: [
  {
    name: "Coorg (Madikeri)",
    description: "Scenic hill station known for coffee plantations, waterfalls, and Abbey Falls.",
    map: "https://www.google.com/maps/place/Coorg,+Karnataka",
    hotels: [
      { name: "Taj Madikeri Resort & Spa", map: "https://www.google.com/maps/search/Taj+Madikeri+Resort+%26+Spa" },
      { name: "Coorg Wilderness Resort", map: "https://www.google.com/maps/search/Coorg+Wilderness+Resort" }
    ]
  },
  {
    name: "Mysore Palace",
    description: "Magnificent Indo-Saracenic palace and one of India's grandest royal residences.",
    map: "https://www.google.com/maps/place/Mysore+Palace",
    hotels: [
      { name: "Radisson Blu Plaza Mysore", map: "https://www.google.com/maps/search/Radisson+Blu+Plaza+Mysore" },
      { name: "Fortune JP Palace", map: "https://www.google.com/maps/search/Fortune+JP+Palace+Mysore" }
    ]
  },
  {
    name: "Jog Falls",
    description: "Second highest plunge waterfall in India, spectacular during monsoon.",
    map: "https://www.google.com/maps/place/Jog+Falls,+Karnataka",
    hotels: [
      { name: "KSTDC Mayura Gerusoppa", map: "https://www.google.com/maps/search/KSTDC+Mayura+Gerusoppa+Jog+Falls" },
      { name: "Nearby Stay Options", map: "https://www.google.com/maps/search/hotels+near+Jog+Falls" }
    ]
  },
  {
    name: "Hampi",
    description: "UNESCO World Heritage site known for ruins of Vijayanagara Empire.",
    map: "https://www.google.com/maps/place/Hampi,+Karnataka",
    hotels: [
      { name: "Evolve Back Hampi", map: "https://www.google.com/maps/search/Evolve+Back+Hampi" },
      { name: "Heritage Resort Hampi", map: "https://www.google.com/maps/search/Heritage+Resort+Hampi" }
    ]
  },
  {
    name: "Gokarna Beach",
    description: "Peaceful coastal town with pristine beaches and temples.",
    map: "https://www.google.com/maps/place/Gokarna,+Karnataka",
    hotels: [
      { name: "Om Beach Resort", map: "https://www.google.com/maps/search/Om+Beach+Resort+Gokarna" },
      { name: "Sanskruti Resort", map: "https://www.google.com/maps/search/Sanskruti+Resort+Gokarna" }
    ]
  },
  {
    name: "Bannerghatta Biological Park",
    description: "Famous wildlife park near Bangalore with safari, zoo, and butterfly park.",
    map: "https://www.google.com/maps/place/Bannerghatta+Biological+Park",
    hotels: [
      { name: "Lemon Tree Hotel Electronic City", map: "https://www.google.com/maps/search/Lemon+Tree+Hotel+Electronic+City" },
      { name: "Holiday Village Resort", map: "https://www.google.com/maps/search/Holiday+Village+Resort+Bangalore" }
    ]
  },
  {
    name: "Nandi Hills",
    description: "Popular sunrise point and weekend getaway near Bangalore.",
    map: "https://www.google.com/maps/place/Nandi+Hills,+Karnataka",
    hotels: [
      { name: "Mount Palazzo", map: "https://www.google.com/maps/search/Mount+Palazzo+Nandi+Hills" },
      { name: "Silver Mist Homestay", map: "https://www.google.com/maps/search/Silver+Mist+Homestay+Nandi+Hills" }
    ]
  },
  {
  name: "Chikmagalur",
  description: "Beautiful hill station known for coffee estates, Mullayanagiri Peak, and scenic drives.",
  map: "https://www.google.com/maps/place/Chikmagalur,+Karnataka",
  hotels: [
    { name: "The Serai Chikmagalur", map: "https://www.google.com/maps/search/The+Serai+Chikmagalur" },
    { name: "Trivik Hotels & Resorts", map: "https://www.google.com/maps/search/Trivik+Hotels+Chikmagalur" }
  ]
},
{
  name: "Udupi Krishna Temple",
  description: "Ancient temple town known for Sri Krishna Matha and coastal cuisine.",
  map: "https://www.google.com/maps/place/Udupi,+Karnataka",
  hotels: [
    { name: "Fortune Inn Valley View", map: "https://www.google.com/maps/search/Fortune+Inn+Valley+View+Udupi" },
    { name: "Paradise Isle Beach Resort", map: "https://www.google.com/maps/search/Paradise+Isle+Beach+Resort+Udupi" }
  ]
},
{
  name: "Kabini Wildlife Sanctuary",
  description: "Wildlife reserve known for elephants, tigers, and serene river backwaters.",
  map: "https://www.google.com/maps/place/Kabini,+Karnataka",
  hotels: [
    { name: "Kaav Safari Lodge", map: "https://www.google.com/maps/search/Kaav+Safari+Lodge+Kabini" },
    { name: "The Serai Kabini", map: "https://www.google.com/maps/search/The+Serai+Kabini" }
  ]
}
],
maharashtra: [
  {
    name: "Gateway of India (Mumbai)",
    description: "Iconic arch monument overlooking the Arabian Sea, built in 1924.",
    map: "https://www.google.com/maps/place/Gateway+of+India,+Mumbai",
    hotels: [
      { name: "The Taj Mahal Palace", map: "https://www.google.com/maps/search/The+Taj+Mahal+Palace+Mumbai" },
      { name: "Trident Nariman Point", map: "https://www.google.com/maps/search/Trident+Nariman+Point+Mumbai" }
    ]
  },
  {
    name: "Ajanta & Ellora Caves",
    description: "UNESCO World Heritage rock-cut Buddhist, Hindu, and Jain caves near Aurangabad.",
    map: "https://www.google.com/maps/place/Ajanta+Caves",
    hotels: [
      { name: "Vivanta Aurangabad", map: "https://www.google.com/maps/search/Vivanta+Aurangabad" },
      { name: "Lemon Tree Hotel Aurangabad", map: "https://www.google.com/maps/search/Lemon+Tree+Hotel+Aurangabad" }
    ]
  },
  {
    name: "Lonavala & Khandala",
    description: "Popular twin hill stations near Mumbai known for waterfalls and viewpoints.",
    map: "https://www.google.com/maps/place/Lonavala,+Maharashtra",
    hotels: [
      { name: "Della Resorts", map: "https://www.google.com/maps/search/Della+Resorts+Lonavala" },
      { name: "The Machan", map: "https://www.google.com/maps/search/The+Machan+Lonavala" }
    ]
  },
  {
    name: "Mahabaleshwar",
    description: "Hill station famous for strawberries, viewpoints, and Venna Lake.",
    map: "https://www.google.com/maps/place/Mahabaleshwar,+Maharashtra",
    hotels: [
      { name: "Evershine Resort", map: "https://www.google.com/maps/search/Evershine+Resort+Mahabaleshwar" },
      { name: "Le Méridien Mahabaleshwar", map: "https://www.google.com/maps/search/Le+Meridien+Mahabaleshwar" }
    ]
  },
  {
    name: "Shirdi Sai Baba Temple",
    description: "Major pilgrimage site dedicated to Shirdi Sai Baba, visited by millions annually.",
    map: "https://www.google.com/maps/place/Shirdi,+Maharashtra",
    hotels: [
      { name: "Sun-n-Sand Shirdi", map: "https://www.google.com/maps/search/Sun+n+Sand+Shirdi" },
      { name: "St Laurn The Spiritual Resort", map: "https://www.google.com/maps/search/St+Laurn+The+Spiritual+Resort+Shirdi" }
    ]
  },
  {
    name: "Alibaug Beach",
    description: "Peaceful beach getaway from Mumbai, known for forts and water sports.",
    map: "https://www.google.com/maps/place/Alibaug,+Maharashtra",
    hotels: [
      { name: "Radisson Blu Resort Alibaug", map: "https://www.google.com/maps/search/Radisson+Blu+Resort+Alibaug" },
      { name: "Maple IVY Hotel", map: "https://www.google.com/maps/search/Maple+IVY+Hotel+Alibaug" }
    ]
  },
  {
    name: "Tadoba Andhari Tiger Reserve",
    description: "Largest national park in Maharashtra, home to tigers and diverse wildlife.",
    map: "https://www.google.com/maps/place/Tadoba+Andhari+Tiger+Reserve",
    hotels: [
      { name: "Svasara Jungle Lodge", map: "https://www.google.com/maps/search/Svasara+Jungle+Lodge+Tadoba" },
      { name: "Irai Safari Retreat", map: "https://www.google.com/maps/search/Irai+Safari+Retreat+Tadoba" }
    ]
  },
  {
    name: "Pune Shaniwar Wada",
    description: "Historic Maratha fortification in Pune built in 1732.",
    map: "https://www.google.com/maps/place/Shaniwar+Wada,+Pune",
    hotels: [
      { name: "JW Marriott Hotel Pune", map: "https://www.google.com/maps/search/JW+Marriott+Hotel+Pune" },
      { name: "Conrad Pune", map: "https://www.google.com/maps/search/Conrad+Pune" }
    ]
  },
  {
    name: "Nashik Vineyards (Sula Wines)",
    description: "Wine capital of India, known for vineyards and tasting tours.",
    map: "https://www.google.com/maps/place/Sula+Vineyards,+Nashik",
    hotels: [
      { name: "Beyond by Sula", map: "https://www.google.com/maps/search/Beyond+by+Sula+Nashik" },
      { name: "Express Inn Nashik", map: "https://www.google.com/maps/search/Express+Inn+Nashik" }
    ]
  },
  {
    name: "Matheran",
    description: "Eco-sensitive hill station where vehicles are banned; known for toy train and scenic views.",
    map: "https://www.google.com/maps/place/Matheran,+Maharashtra",
    hotels: [
      { name: "Usha Ascot", map: "https://www.google.com/maps/search/Usha+Ascot+Matheran" },
      { name: "Horseland Hotel", map: "https://www.google.com/maps/search/Horseland+Hotel+Matheran" }
    ]
  }
],
rajasthan: [
  {
    name: "Jaipur – The Pink City",
    description: "Capital of Rajasthan known for Amber Fort, City Palace, Hawa Mahal, and vibrant bazaars.",
    map: "https://www.google.com/maps/place/Jaipur,+Rajasthan",
    hotels: [
      { name: "Rambagh Palace", map: "https://www.google.com/maps/search/Rambagh+Palace+Jaipur" },
      { name: "ITC Rajputana", map: "https://www.google.com/maps/search/ITC+Rajputana+Jaipur" }
    ]
  },
  {
    name: "Udaipur – The City of Lakes",
    description: "Famous for Lake Pichola, City Palace, and romantic lakeside views.",
    map: "https://www.google.com/maps/place/Udaipur,+Rajasthan",
    hotels: [
      { name: "The Oberoi Udaivilas", map: "https://www.google.com/maps/search/The+Oberoi+Udaivilas+Udaipur" },
      { name: "Taj Lake Palace", map: "https://www.google.com/maps/search/Taj+Lake+Palace+Udaipur" }
    ]
  },
  {
    name: "Jaisalmer – The Golden City",
    description: "Desert city known for Jaisalmer Fort, Sam Sand Dunes, and camel safaris.",
    map: "https://www.google.com/maps/place/Jaisalmer,+Rajasthan",
    hotels: [
      { name: "Suryagarh Jaisalmer", map: "https://www.google.com/maps/search/Suryagarh+Jaisalmer" },
      { name: "Desert Tulip Hotel & Resort", map: "https://www.google.com/maps/search/Desert+Tulip+Hotel+Jaisalmer" }
    ]
  },
  {
    name: "Jodhpur – The Blue City",
    description: "Home to Mehrangarh Fort, Umaid Bhawan Palace, and blue-painted houses.",
    map: "https://www.google.com/maps/place/Jodhpur,+Rajasthan",
    hotels: [
      { name: "Umaid Bhawan Palace", map: "https://www.google.com/maps/search/Umaid+Bhawan+Palace+Jodhpur" },
      { name: "RAAS Jodhpur", map: "https://www.google.com/maps/search/RAAS+Jodhpur" }
    ]
  },
  {
    name: "Mount Abu",
    description: "Rajasthan’s only hill station, known for Nakki Lake and Dilwara Temples.",
    map: "https://www.google.com/maps/place/Mount+Abu,+Rajasthan",
    hotels: [
      { name: "Cama Rajputana Club Resort", map: "https://www.google.com/maps/search/Cama+Rajputana+Club+Resort+Mount+Abu" },
      { name: "Hillock Hotel", map: "https://www.google.com/maps/search/Hotel+Hillock+Mount+Abu" }
    ]
  },
  {
    name: "Pushkar",
    description: "Sacred town famous for Brahma Temple and annual Camel Fair.",
    map: "https://www.google.com/maps/place/Pushkar,+Rajasthan",
    hotels: [
      { name: "Ananta Spa & Resort", map: "https://www.google.com/maps/search/Ananta+Spa+%26+Resort+Pushkar" },
      { name: "Pushkar Palace", map: "https://www.google.com/maps/search/Pushkar+Palace+Hotel" }
    ]
  },
  {
    name: "Ranthambore National Park",
    description: "Popular wildlife reserve known for Bengal tigers and historic Ranthambore Fort.",
    map: "https://www.google.com/maps/place/Ranthambore+National+Park,+Rajasthan",
    hotels: [
      { name: "The Oberoi Vanyavilas", map: "https://www.google.com/maps/search/The+Oberoi+Vanyavilas+Ranthambore" },
      { name: "Nahargarh Ranthambhore", map: "https://www.google.com/maps/search/Nahargarh+Ranthambhore" }
    ]
  }
],
kerala: [
  {
    name: "Munnar",
    description: "Hill station famous for tea plantations, Eravikulam National Park, and misty peaks.",
    map: "https://www.google.com/maps/place/Munnar,+Kerala",
    hotels: [
      { name: "Tea County Munnar", map: "https://www.google.com/maps/search/Tea+County+Munnar" },
      { name: "The Fog Resort", map: "https://www.google.com/maps/search/The+Fog+Resort+Munnar" }
    ]
  },
  {
    name: "Alleppey (Alappuzha)",
    description: "Known for houseboats and scenic backwaters, often called the 'Venice of the East'.",
    map: "https://www.google.com/maps/place/Alleppey,+Kerala",
    hotels: [
      { name: "Lake Palace Resort", map: "https://www.google.com/maps/search/Lake+Palace+Resort+Alleppey" },
      { name: "Punnamada Resort", map: "https://www.google.com/maps/search/Punnamada+Resort+Alleppey" }
    ]
  },
  {
    name: "Kovalam Beach",
    description: "Popular crescent-shaped beach near Thiruvananthapuram known for lighthouse views.",
    map: "https://www.google.com/maps/place/Kovalam,+Kerala",
    hotels: [
      { name: "The Leela Kovalam", map: "https://www.google.com/maps/search/The+Leela+Kovalam" },
      { name: "Uday Samudra Leisure Beach Hotel", map: "https://www.google.com/maps/search/Uday+Samudra+Hotel+Kovalam" }
    ]
  },
  {
    name: "Athirappilly Waterfalls",
    description: "Magnificent waterfall often called the 'Niagara of India'.",
    map: "https://www.google.com/maps/place/Athirappilly+Waterfalls,+Kerala",
    hotels: [
      { name: "Rainforest Resort", map: "https://www.google.com/maps/search/Rainforest+Resort+Athirappilly" },
      { name: "Samroha Resort", map: "https://www.google.com/maps/search/Samroha+Resort+Athirappilly" }
    ]
  },
  {
    name: "Wayanad",
    description: "Hill district rich with forests, wildlife, Edakkal Caves, and Banasura Sagar Dam.",
    map: "https://www.google.com/maps/place/Wayanad,+Kerala",
    hotels: [
      { name: "Vythiri Resort", map: "https://www.google.com/maps/search/Vythiri+Resort+Wayanad" },
      { name: "Banasura Hill Resort", map: "https://www.google.com/maps/search/Banasura+Hill+Resort+Wayanad" }
    ]
  },
  {
    name: "Kumarakom",
    description: "Backwater village on Vembanad Lake known for bird sanctuary and houseboats.",
    map: "https://www.google.com/maps/place/Kumarakom,+Kerala",
    hotels: [
      { name: "The Zuri Kumarakom", map: "https://www.google.com/maps/search/The+Zuri+Kumarakom" },
      { name: "Aveda Kumarakom", map: "https://www.google.com/maps/search/Aveda+Kumarakom" }
    ]
  },
  {
    name: "Varkala Cliff Beach",
    description: "Scenic beach with cliffs, cafes, and spiritual ambiance near Trivandrum.",
    map: "https://www.google.com/maps/place/Varkala,+Kerala",
    hotels: [
      { name: "Hindustan Beach Retreat", map: "https://www.google.com/maps/search/Hindustan+Beach+Retreat+Varkala" },
      { name: "Gateway Varkala", map: "https://www.google.com/maps/search/The+Gateway+Hotel+Varkala" }
    ]
  }
],
tamilnadu: [
  {
    name: "Chennai Marina Beach",
    description: "One of the longest urban beaches in the world, perfect for sunrise walks and street food.",
    map: "https://www.google.com/maps/place/Marina+Beach,+Chennai",
    hotels: [
      { name: "Taj Club House", map: "https://www.google.com/maps/search/Taj+Club+House+Chennai" },
      { name: "The Leela Palace Chennai", map: "https://www.google.com/maps/search/The+Leela+Palace+Chennai" }
    ]
  },
  {
    name: "Madurai Meenakshi Amman Temple",
    description: "Ancient Dravidian-style temple dedicated to Goddess Meenakshi, iconic gopurams and rituals.",
    map: "https://www.google.com/maps/place/Meenakshi+Amman+Temple,+Madurai",
    hotels: [
      { name: "Heritage Madurai", map: "https://www.google.com/maps/search/Heritage+Madurai" },
      { name: "The Gateway Hotel Madurai", map: "https://www.google.com/maps/search/The+Gateway+Hotel+Madurai" }
    ]
  },
  {
    name: "Ooty (Udhagamandalam)",
    description: "Popular hill station in Nilgiris, famous for botanical gardens and toy train.",
    map: "https://www.google.com/maps/place/Ooty,+Tamil+Nadu",
    hotels: [
      { name: "Sterling Ooty Fern Hill", map: "https://www.google.com/maps/search/Sterling+Ooty+Fern+Hill" },
      { name: "Club Mahindra Derby Green", map: "https://www.google.com/maps/search/Club+Mahindra+Derby+Green+Ooty" }
    ]
  },
  {
    name: "Kodaikanal",
    description: "Misty hill retreat with a beautiful lake, waterfalls, and trekking trails.",
    map: "https://www.google.com/maps/place/Kodaikanal,+Tamil+Nadu",
    hotels: [
      { name: "The Carlton Kodaikanal", map: "https://www.google.com/maps/search/The+Carlton+Kodaikanal" },
      { name: "Kodai Resort Hotel", map: "https://www.google.com/maps/search/Kodai+Resort+Hotel" }
    ]
  },
  {
    name: "Rameswaram",
    description: "Sacred island town famous for Ramanathaswamy Temple and Pamban Bridge.",
    map: "https://www.google.com/maps/place/Rameswaram,+Tamil+Nadu",
    hotels: [
      { name: "Daiwik Hotels Rameswaram", map: "https://www.google.com/maps/search/Daiwik+Hotels+Rameswaram" },
      { name: "Hotel Royal Park", map: "https://www.google.com/maps/search/Hotel+Royal+Park+Rameswaram" }
    ]
  },
  {
    name: "Kanchipuram",
    description: "Known as the 'City of Thousand Temples', famous for silk sarees and ancient shrines.",
    map: "https://www.google.com/maps/place/Kanchipuram,+Tamil+Nadu",
    hotels: [
      { name: "Pine Tree Hotels", map: "https://www.google.com/maps/search/Pine+Tree+Hotels+Kanchipuram" },
      { name: "Sparsa Resort", map: "https://www.google.com/maps/search/Sparsa+Resort+Kanchipuram" }
    ]
  },
  {
    name: "Courtallam Waterfalls",
    description: "Cluster of waterfalls in Tirunelveli, called the 'Spa of South India'.",
    map: "https://www.google.com/maps/place/Courtallam,+Tamil+Nadu",
    hotels: [
      { name: "Saaral Resort Courtallam", map: "https://www.google.com/maps/search/Saaral+Resort+Courtallam" },
      { name: "Five Falls Resort", map: "https://www.google.com/maps/search/Five+Falls+Resort+Courtallam" }
    ]
  }
],
telangana: [
  {
    name: "Hyderabad – Charminar & Golconda Fort",
    description: "Historic city with iconic landmarks, biryani, and pearl markets.",
    map: "https://www.google.com/maps/place/Charminar,+Hyderabad",
    hotels: [
      { name: "Taj Falaknuma Palace", map: "https://www.google.com/maps/search/Taj+Falaknuma+Palace+Hyderabad" },
      { name: "ITC Kakatiya", map: "https://www.google.com/maps/search/ITC+Kakatiya+Hyderabad" }
    ]
  },
  {
    name: "Ramoji Film City",
    description: "World’s largest integrated film city — tours, sets, and amusement zones.",
    map: "https://www.google.com/maps/place/Ramoji+Film+City,+Hyderabad",
    hotels: [
      { name: "Hotel Sitara", map: "https://www.google.com/maps/search/Hotel+Sitara+Ramoji" },
      { name: "Tara Comfort Hotel", map: "https://www.google.com/maps/search/Tara+Comfort+Hotel+Ramoji" }
    ]
  },
  {
    name: "Warangal Fort & Thousand Pillar Temple",
    description: "Historic Kakatiya-era architecture with detailed carvings.",
    map: "https://www.google.com/maps/place/Warangal+Fort,+Telangana",
    hotels: [
      { name: "Radisson Hotel Warangal", map: "https://www.google.com/maps/search/Radisson+Hotel+Warangal" },
      { name: "Landmark Hotel", map: "https://www.google.com/maps/search/Landmark+Hotel+Warangal" }
    ]
  },
  {
    name: "Nagarjuna Sagar Dam",
    description: "Massive dam on River Krishna surrounded by scenic landscapes and boating.",
    map: "https://www.google.com/maps/place/Nagarjuna+Sagar+Dam,+Telangana",
    hotels: [
      { name: "Haritha Vijay Vihar", map: "https://www.google.com/maps/search/Haritha+Vijay+Vihar+Nagarjuna+Sagar" },
      { name: "Nearby Resorts", map: "https://www.google.com/maps/search/resorts+near+Nagarjuna+Sagar" }
    ]
  },
  {
    name: "Kuntala Waterfall",
    description: "Highest waterfall in Telangana, located amidst dense forests.",
    map: "https://www.google.com/maps/place/Kuntala+Waterfall,+Telangana",
    hotels: [
      { name: "Forest Rest House", map: "https://www.google.com/maps/search/Forest+Rest+House+Kuntala" },
      { name: "Nearby Stays", map: "https://www.google.com/maps/search/hotels+near+Kuntala+Waterfall" }
    ]
  },
  {
    name: "Ananthagiri Hills",
    description: "Lush hill station near Vikarabad known for trekking and coffee plantations.",
    map: "https://www.google.com/maps/place/Ananthagiri+Hills,+Telangana",
    hotels: [
      { name: "Haritha Resort", map: "https://www.google.com/maps/search/Haritha+Resort+Ananthagiri" },
      { name: "Vikarabad Homestays", map: "https://www.google.com/maps/search/homestays+near+Ananthagiri+Hills" }
    ]
  },
  {
    name: "Yadadri Temple",
    description: "Renovated temple dedicated to Lord Narasimha, near Hyderabad.",
    map: "https://www.google.com/maps/place/Yadadri+Temple,+Telangana",
    hotels: [
      { name: "Hotel Surabhi Pride", map: "https://www.google.com/maps/search/Hotel+Surabhi+Pride+Yadadri" },
      { name: "Nearby Lodges", map: "https://www.google.com/maps/search/lodges+near+Yadadri+Temple" }
    ]
  }
],
andhrapradesh: [
  {
    name: "Visakhapatnam (Vizag) – RK Beach",
    description: "Coastal city known for beaches, Kailasagiri Hill, and Submarine Museum.",
    map: "https://www.google.com/maps/place/RK+Beach,+Visakhapatnam",
    hotels: [
      { name: "The Park Visakhapatnam", map: "https://www.google.com/maps/search/The+Park+Visakhapatnam" },
      { name: "Novotel Varun Beach", map: "https://www.google.com/maps/search/Novotel+Varun+Beach+Visakhapatnam" }
    ]
  },
  {
    name: "Tirupati – Sri Venkateswara Temple",
    description: "One of the most visited pilgrimage centers in India, dedicated to Lord Balaji.",
    map: "https://www.google.com/maps/place/Tirumala+Venkateswara+Temple,+Tirupati",
    hotels: [
      { name: "Fortune Select Grand Ridge", map: "https://www.google.com/maps/search/Fortune+Select+Grand+Ridge+Tirupati" },
      { name: "Tirumala Cottages", map: "https://www.google.com/maps/search/hotels+near+Tirupati+Temple" }
    ]
  },
  {
    name: "Araku Valley",
    description: "Hill station surrounded by coffee plantations, waterfalls, and tribal culture.",
    map: "https://www.google.com/maps/place/Araku+Valley,+Andhra+Pradesh",
    hotels: [
      { name: "Haritha Valley Resort", map: "https://www.google.com/maps/search/Haritha+Valley+Resort+Araku" },
      { name: "Hill View Resort", map: "https://www.google.com/maps/search/Hill+View+Resort+Araku" }
    ]
  },
  {
    name: "Borra Caves",
    description: "Limestone caves with stalactites and stalagmites formations in Ananthagiri Hills.",
    map: "https://www.google.com/maps/place/Borra+Caves,+Andhra+Pradesh",
    hotels: [
      { name: "Borra Guest House", map: "https://www.google.com/maps/search/guest+house+near+Borra+Caves" },
      { name: "Araku Haritha Resort", map: "https://www.google.com/maps/search/Araku+Haritha+Resort" }
    ]
  },
  {
    name: "Gandikota – The Grand Canyon of India",
    description: "Spectacular gorge formed by River Pennar, with ancient fort ruins nearby.",
    map: "https://www.google.com/maps/place/Gandikota,+Andhra+Pradesh",
    hotels: [
      { name: "APTDC Haritha Resort Gandikota", map: "https://www.google.com/maps/search/Haritha+Resort+Gandikota" },
      { name: "Nearby Campsites", map: "https://www.google.com/maps/search/camping+near+Gandikota" }
    ]
  },
  {
    name: "Srisailam Temple",
    description: "Jyotirlinga temple of Lord Mallikarjuna on the banks of Krishna River.",
    map: "https://www.google.com/maps/place/Srisailam,+Andhra+Pradesh",
    hotels: [
      { name: "Haritha Hotel Srisailam", map: "https://www.google.com/maps/search/Haritha+Hotel+Srisailam" },
      { name: "Local Lodges", map: "https://www.google.com/maps/search/lodges+near+Srisailam+Temple" }
    ]
  },
  {
    name: "Kondapalli Fort & Toys Village",
    description: "Historic fort and traditional wooden toy-making village near Vijayawada.",
    map: "https://www.google.com/maps/place/Kondapalli,+Andhra+Pradesh",
    hotels: [
      { name: "Lemon Tree Premier Vijayawada", map: "https://www.google.com/maps/search/Lemon+Tree+Premier+Vijayawada" },
      { name: "Gateway Hotel Vijayawada", map: "https://www.google.com/maps/search/Gateway+Hotel+Vijayawada" }
    ]
  }
],
madhyapradesh: [
  {
    name: "Khajuraho Temples",
    description: "UNESCO World Heritage site known for stunning Nagara-style temples with intricate sculptures.",
    map: "https://www.google.com/maps/place/Khajuraho,+Madhya+Pradesh",
    hotels: [
      { name: "The Lalit Temple View Khajuraho", map: "https://www.google.com/maps/search/The+Lalit+Temple+View+Khajuraho" },
      { name: "Hotel Isabel Palace", map: "https://www.google.com/maps/search/Hotel+Isabel+Palace+Khajuraho" }
    ]
  },
  {
    name: "Kanha National Park",
    description: "Famous tiger reserve and inspiration for 'The Jungle Book'.",
    map: "https://www.google.com/maps/place/Kanha+National+Park,+Madhya+Pradesh",
    hotels: [
      { name: "Taj Banjaar Tola", map: "https://www.google.com/maps/search/Taj+Banjaar+Tola+Kanha" },
      { name: "Kanha Earth Lodge", map: "https://www.google.com/maps/search/Kanha+Earth+Lodge" }
    ]
  },
  {
    name: "Sanchi Stupa",
    description: "Ancient Buddhist monument and UNESCO World Heritage site near Bhopal.",
    map: "https://www.google.com/maps/place/Sanchi,+Madhya+Pradesh",
    hotels: [
      { name: "Gateway Retreat Sanchi", map: "https://www.google.com/maps/search/Gateway+Retreat+Sanchi" },
      { name: "Nearby Lodges", map: "https://www.google.com/maps/search/hotels+near+Sanchi+Stupa" }
    ]
  },
  {
    name: "Ujjain – Mahakaleshwar Temple",
    description: "One of the 12 Jyotirlingas, located on the banks of the Shipra River.",
    map: "https://www.google.com/maps/place/Mahakaleshwar+Temple,+Ujjain",
    hotels: [
      { name: "Hotel Abika Elite", map: "https://www.google.com/maps/search/Hotel+Abika+Elite+Ujjain" },
      { name: "Anjushree Hotel", map: "https://www.google.com/maps/search/Anjushree+Hotel+Ujjain" }
    ]
  },
  {
    name: "Bandhavgarh National Park",
    description: "Another popular tiger reserve with jungle safaris and ancient Bandhavgarh Fort.",
    map: "https://www.google.com/maps/place/Bandhavgarh+National+Park",
    hotels: [
      { name: "Mahua Kothi", map: "https://www.google.com/maps/search/Mahua+Kothi+Bandhavgarh" },
      { name: "Tigergarh Resort", map: "https://www.google.com/maps/search/Tigergarh+Resort+Bandhavgarh" }
    ]
  },
  {
    name: "Bhedaghat – Marble Rocks",
    description: "Scenic gorge on the Narmada River famous for boat rides and Dhuandhar Falls.",
    map: "https://www.google.com/maps/place/Bhedaghat,+Madhya+Pradesh",
    hotels: [
      { name: "Hotel River View", map: "https://www.google.com/maps/search/Hotel+River+View+Bhedaghat" },
      { name: "Narmada Retreat", map: "https://www.google.com/maps/search/Narmada+Retreat+Bhedaghat" }
    ]
  },
  {
    name: "Pachmarhi Hill Station",
    description: "Beautiful hill station known as 'Queen of Satpura' with waterfalls and caves.",
    map: "https://www.google.com/maps/place/Pachmarhi,+Madhya+Pradesh",
    hotels: [
      { name: "WelcomHeritage Golf View", map: "https://www.google.com/maps/search/WelcomHeritage+Golf+View+Pachmarhi" },
      { name: "Hotel Amrapali", map: "https://www.google.com/maps/search/Hotel+Amrapali+Pachmarhi" }
    ]
  }
],
uttarpradesh: [
  {
    name: "Taj Mahal, Agra",
    description: "World-famous white marble mausoleum built by Emperor Shah Jahan in memory of Mumtaz Mahal.",
    map: "https://www.google.com/maps/place/Taj+Mahal,+Agra",
    hotels: [
      { name: "The Oberoi Amarvilas", map: "https://www.google.com/maps/search/The+Oberoi+Amarvilas+Agra" },
      { name: "ITC Mughal", map: "https://www.google.com/maps/search/ITC+Mughal+Agra" }
    ]
  },
  {
    name: "Varanasi Ghats",
    description: "Spiritual capital of India along the Ganges, known for evening Aarti at Dashashwamedh Ghat.",
    map: "https://www.google.com/maps/place/Varanasi,+Uttar+Pradesh",
    hotels: [
      { name: "BrijRama Palace", map: "https://www.google.com/maps/search/BrijRama+Palace+Varanasi" },
      { name: "Taj Ganges", map: "https://www.google.com/maps/search/Taj+Ganges+Varanasi" }
    ]
  },
  {
    name: "Fatehpur Sikri",
    description: "Historic Mughal city built by Akbar, a UNESCO World Heritage site.",
    map: "https://www.google.com/maps/place/Fatehpur+Sikri,+Uttar+Pradesh",
    hotels: [
      { name: "The Grand Barso", map: "https://www.google.com/maps/search/The+Grand+Barso+Fatehpur+Sikri" },
      { name: "Hotel Goverdhan Tourist Complex", map: "https://www.google.com/maps/search/Hotel+Goverdhan+Tourist+Complex+Fatehpur+Sikri" }
    ]
  },
  {
    name: "Lucknow – Bara Imambara",
    description: "Architectural marvel built by Nawab Asaf-ud-Daula, featuring the famous Bhool Bhulaiya maze.",
    map: "https://www.google.com/maps/place/Bara+Imambara,+Lucknow",
    hotels: [
      { name: "Taj Mahal Lucknow", map: "https://www.google.com/maps/search/Taj+Mahal+Lucknow" },
      { name: "Lebua Lucknow", map: "https://www.google.com/maps/search/Lebua+Lucknow" }
    ]
  },
  {
    name: "Mathura & Vrindavan",
    description: "Birthplace of Lord Krishna and a major pilgrimage site for devotees.",
    map: "https://www.google.com/maps/place/Mathura,+Uttar+Pradesh",
    hotels: [
      { name: "Nidhivan Sarovar Portico", map: "https://www.google.com/maps/search/Nidhivan+Sarovar+Portico+Vrindavan" },
      { name: "The Radha Ashok", map: "https://www.google.com/maps/search/The+Radha+Ashok+Mathura" }
    ]
  },
  {
    name: "Prayagraj (Allahabad) – Triveni Sangam",
    description: "Confluence of Ganga, Yamuna, and Saraswati rivers, famous for Kumbh Mela.",
    map: "https://www.google.com/maps/place/Triveni+Sangam,+Prayagraj",
    hotels: [
      { name: "Hotel Kanha Shyam", map: "https://www.google.com/maps/search/Hotel+Kanha+Shyam+Prayagraj" },
      { name: "Millennium Inn", map: "https://www.google.com/maps/search/Millennium+Inn+Prayagraj" }
    ]
  },
  {
    name: "Ayodhya – Ram Janmabhoomi",
    description: "Historic and spiritual city, birthplace of Lord Rama, now home to the Ram Temple.",
    map: "https://www.google.com/maps/place/Ayodhya,+Uttar+Pradesh",
    hotels: [
      { name: "Tirupati Hotel", map: "https://www.google.com/maps/search/Tirupati+Hotel+Ayodhya" },
      { name: "Hotel Ramprastha", map: "https://www.google.com/maps/search/Hotel+Ramprastha+Ayodhya" }
    ]
  }
],
gujarat: [
  {
    name: "Somnath Temple",
    description: "One of the 12 Jyotirlingas dedicated to Lord Shiva, located by the Arabian Sea.",
    map: "https://www.google.com/maps/place/Somnath+Temple,+Gujarat",
    hotels: [
      { name: "The Fern Residency Somnath", map: "https://www.google.com/maps/search/The+Fern+Residency+Somnath" },
      { name: "Lords Inn Somnath", map: "https://www.google.com/maps/search/Lords+Inn+Somnath" }
    ]
  },
  {
    name: "Dwarkadhish Temple",
    description: "Ancient temple dedicated to Lord Krishna, one of the Char Dham pilgrimage sites.",
    map: "https://www.google.com/maps/place/Dwarkadhish+Temple,+Dwarka,+Gujarat",
    hotels: [
      { name: "Hotel Roma Kristo", map: "https://www.google.com/maps/search/Hotel+Roma+Kristo+Dwarka" },
      { name: "Ginger Dwarka", map: "https://www.google.com/maps/search/Ginger+Dwarka" }
    ]
  },
  {
    name: "Gir National Park",
    description: "The only home of Asiatic lions in the world, offering safaris and nature trails.",
    map: "https://www.google.com/maps/place/Gir+National+Park,+Gujarat",
    hotels: [
      { name: "Gir Jungle Lodge", map: "https://www.google.com/maps/search/Gir+Jungle+Lodge" },
      { name: "Woods at Sasan", map: "https://www.google.com/maps/search/Woods+at+Sasan" }
    ]
  },
  {
    name: "Rann of Kutch",
    description: "A vast white salt desert that shines under the full moon; host of Rann Utsav.",
    map: "https://www.google.com/maps/place/Great+Rann+of+Kutch,+Gujarat",
    hotels: [
      { name: "Rann Utsav Tent City", map: "https://www.google.com/maps/search/Rann+Utsav+Tent+City" },
      { name: "Shaam-e-Sarhad Village Resort", map: "https://www.google.com/maps/search/Shaam-e-Sarhad+Village+Resort" }
    ]
  },
  {
    name: "Statue of Unity",
    description: "World’s tallest statue dedicated to Sardar Vallabhbhai Patel near Sardar Sarovar Dam.",
    map: "https://www.google.com/maps/place/Statue+of+Unity,+Kevadia,+Gujarat",
    hotels: [
      { name: "Tent City Narmada", map: "https://www.google.com/maps/search/Tent+City+Narmada" },
      { name: "Fern Sardar Sarovar Resort", map: "https://www.google.com/maps/search/Fern+Sardar+Sarovar+Resort" }
    ]
  },
  {
    name: "Saputara Hill Station",
    description: "Beautiful hill station with lakes, viewpoints, and adventure parks on the Maharashtra border.",
    map: "https://www.google.com/maps/place/Saputara,+Gujarat",
    hotels: [
      { name: "Aakar Lords Inn", map: "https://www.google.com/maps/search/Aakar+Lords+Inn+Saputara" },
      { name: "Hotel Lake View", map: "https://www.google.com/maps/search/Hotel+Lake+View+Saputara" }
    ]
  },
  {
    name: "Ahmedabad Heritage City",
    description: "India’s first UNESCO World Heritage City, known for Sabarmati Ashram and traditional pols.",
    map: "https://www.google.com/maps/place/Ahmedabad,+Gujarat",
    hotels: [
      { name: "House of MG", map: "https://www.google.com/maps/search/House+of+MG+Ahmedabad" },
      { name: "Hyatt Regency Ahmedabad", map: "https://www.google.com/maps/search/Hyatt+Regency+Ahmedabad" }
    ]
  }
],
westbengal: [
  {
    name: "Kolkata (City of Joy)",
    description: "Cultural capital of India, home to Howrah Bridge, Victoria Memorial, and rich colonial heritage.",
    map: "https://www.google.com/maps/place/Kolkata,+West+Bengal",
    hotels: [
      { name: "The Oberoi Grand", map: "https://www.google.com/maps/search/The+Oberoi+Grand+Kolkata" },
      { name: "Taj Bengal", map: "https://www.google.com/maps/search/Taj+Bengal+Kolkata" }
    ]
  },
  {
    name: "Darjeeling",
    description: "Scenic hill station known for tea gardens, Toy Train, and panoramic views of Kanchenjunga.",
    map: "https://www.google.com/maps/place/Darjeeling,+West+Bengal",
    hotels: [
      { name: "Mayfair Darjeeling", map: "https://www.google.com/maps/search/Mayfair+Darjeeling" },
      { name: "Cedar Inn", map: "https://www.google.com/maps/search/Cedar+Inn+Darjeeling" }
    ]
  },
  {
    name: "Sundarbans National Park",
    description: "World’s largest mangrove forest and home to the famous Royal Bengal Tiger.",
    map: "https://www.google.com/maps/place/Sundarbans+National+Park,+West+Bengal",
    hotels: [
      { name: "Sundarban Tiger Camp", map: "https://www.google.com/maps/search/Sundarban+Tiger+Camp" },
      { name: "Eco Village Resort", map: "https://www.google.com/maps/search/Eco+Village+Resort+Sundarbans" }
    ]
  },
  {
    name: "Kalimpong",
    description: "Peaceful hill town with monasteries, orchid nurseries, and stunning Himalayan views.",
    map: "https://www.google.com/maps/place/Kalimpong,+West+Bengal",
    hotels: [
      { name: "Sinclairs Retreat Kalimpong", map: "https://www.google.com/maps/search/Sinclairs+Retreat+Kalimpong" },
      { name: "The Elgin Silver Oaks", map: "https://www.google.com/maps/search/The+Elgin+Silver+Oaks+Kalimpong" }
    ]
  },
  {
    name: "Murshidabad",
    description: "Historic city with Nawabi architecture and the grand Hazarduari Palace.",
    map: "https://www.google.com/maps/place/Murshidabad,+West+Bengal",
    hotels: [
      { name: "Hotel Sagnik", map: "https://www.google.com/maps/search/Hotel+Sagnik+Murshidabad" },
      { name: "WBTDC Baharampur Tourist Lodge", map: "https://www.google.com/maps/search/WBTDC+Baharampur+Tourist+Lodge" }
    ]
  },
  {
    name: "Digha Beach",
    description: "Popular seaside resort town with wide beaches and seafood stalls.",
    map: "https://www.google.com/maps/place/Digha,+West+Bengal",
    hotels: [
      { name: "Hotel Sea Hawk", map: "https://www.google.com/maps/search/Hotel+Sea+Hawk+Digha" },
      { name: "Le Roi Digha", map: "https://www.google.com/maps/search/Le+Roi+Digha" }
    ]
  },
  {
    name: "Shantiniketan",
    description: "Town founded by Rabindranath Tagore, known for Visva-Bharati University and art festivals.",
    map: "https://www.google.com/maps/place/Shantiniketan,+West+Bengal",
    hotels: [
      { name: "Camellia Resort", map: "https://www.google.com/maps/search/Camellia+Resort+Shantiniketan" },
      { name: "Mark & Meadows", map: "https://www.google.com/maps/search/Mark+%26+Meadows+Shantiniketan" }
    ]
  }
],
punjab: [
  {
    name: "Golden Temple (Harmandir Sahib)",
    description: "Spiritual center of Sikhism in Amritsar, famous for its golden architecture and the holy Sarovar.",
    map: "https://www.google.com/maps/place/Golden+Temple,+Amritsar",
    hotels: [
      { name: "Ramada Amritsar", map: "https://www.google.com/maps/search/Ramada+Amritsar" },
      { name: "Hyatt Regency Amritsar", map: "https://www.google.com/maps/search/Hyatt+Regency+Amritsar" }
    ]
  },
  {
    name: "Wagah Border",
    description: "Famous for the daily evening flag ceremony between India and Pakistan.",
    map: "https://www.google.com/maps/place/Wagah+Border",
    hotels: [
      { name: "Hotel Sawera Grand", map: "https://www.google.com/maps/search/Hotel+Sawera+Grand+Amritsar" },
      { name: "Hotel Hong Kong Inn", map: "https://www.google.com/maps/search/Hotel+Hong+Kong+Inn+Amritsar" }
    ]
  },
  {
    name: "Jallianwala Bagh",
    description: "Historic memorial in Amritsar commemorating the tragic 1919 massacre.",
    map: "https://www.google.com/maps/place/Jallianwala+Bagh,+Amritsar",
    hotels: [
      { name: "Hotel CJ International", map: "https://www.google.com/maps/search/Hotel+CJ+International+Amritsar" },
      { name: "Hotel City Heart", map: "https://www.google.com/maps/search/Hotel+City+Heart+Amritsar" }
    ]
  },
  {
    name: "Chandigarh – Rock Garden & Sukhna Lake",
    description: "Modern city with unique sculptures made from recycled materials and a scenic lake.",
    map: "https://www.google.com/maps/place/Rock+Garden,+Chandigarh",
    hotels: [
      { name: "Taj Chandigarh", map: "https://www.google.com/maps/search/Taj+Chandigarh" },
      { name: "Hotel Mountview", map: "https://www.google.com/maps/search/Hotel+Mountview+Chandigarh" }
    ]
  },
  {
    name: "Anandpur Sahib",
    description: "One of the holiest Sikh towns, known as the birthplace of the Khalsa.",
    map: "https://www.google.com/maps/place/Anandpur+Sahib,+Punjab",
    hotels: [
      { name: "Hotel White City", map: "https://www.google.com/maps/search/Hotel+White+City+Anandpur+Sahib" },
      { name: "Nearby Hotels", map: "https://www.google.com/maps/search/hotels+near+Anandpur+Sahib" }
    ]
  },
  {
    name: "Patiala Fort (Qila Mubarak)",
    description: "Historic royal fort complex representing Patiala’s rich heritage.",
    map: "https://www.google.com/maps/place/Qila+Mubarak,+Patiala",
    hotels: [
      { name: "Neemrana Baradari Palace", map: "https://www.google.com/maps/search/Neemrana+Baradari+Palace+Patiala" },
      { name: "Hotel Mohan Continental", map: "https://www.google.com/maps/search/Hotel+Mohan+Continental+Patiala" }
    ]
  },
  {
    name: "Ludhiana – Punjab Agricultural University Museum",
    description: "Displays the rural lifestyle and agricultural history of Punjab.",
    map: "https://www.google.com/maps/place/Punjab+Agricultural+University+Museum,+Ludhiana",
    hotels: [
      { name: "Radisson Blu Ludhiana", map: "https://www.google.com/maps/search/Radisson+Blu+Ludhiana" },
      { name: "Hyatt Regency Ludhiana", map: "https://www.google.com/maps/search/Hyatt+Regency+Ludhiana" }
    ]
  }
],
haryana: [
  {
    name: "Kurukshetra",
    description: "Historic site of the Mahabharata war, with temples, museums, and Brahma Sarovar.",
    map: "https://www.google.com/maps/place/Kurukshetra,+Haryana",
    hotels: [
      { name: "Hotel Pearl Marc", map: "https://www.google.com/maps/search/Hotel+Pearl+Marc+Kurukshetra" },
      { name: "Hotel Kimaya", map: "https://www.google.com/maps/search/Hotel+Kimaya+Kurukshetra" }
    ]
  },
  {
    name: "Sultanpur National Park",
    description: "Bird sanctuary near Gurgaon, home to over 250 migratory and resident bird species.",
    map: "https://www.google.com/maps/place/Sultanpur+National+Park,+Haryana",
    hotels: [
      { name: "Lemon Tree Premier Gurgaon", map: "https://www.google.com/maps/search/Lemon+Tree+Premier+Gurgaon" },
      { name: "ITC Grand Bharat", map: "https://www.google.com/maps/search/ITC+Grand+Bharat+Gurgaon" }
    ]
  },
  {
    name: "Morni Hills",
    description: "Only hill station in Haryana, known for lakes, trekking, and serene landscapes.",
    map: "https://www.google.com/maps/place/Morni+Hills,+Haryana",
    hotels: [
      { name: "Mountain Quail Hotel", map: "https://www.google.com/maps/search/Mountain+Quail+Hotel+Morni+Hills" },
      { name: "Morni Resorts", map: "https://www.google.com/maps/search/Resorts+in+Morni+Hills" }
    ]
  },
  {
    name: "Pinjore Gardens (Yadavindra Gardens)",
    description: "Mughal-style terraced garden near Chandigarh, with fountains and palaces.",
    map: "https://www.google.com/maps/place/Pinjore+Gardens,+Haryana",
    hotels: [
      { name: "WelcomHeritage Ramgarh", map: "https://www.google.com/maps/search/WelcomHeritage+The+Ramgarh+Panchkula" },
      { name: "Golden Tulip Chandigarh", map: "https://www.google.com/maps/search/Golden+Tulip+Chandigarh+Panchkula" }
    ]
  },
  {
    name: "Damdama Lake",
    description: "Large natural lake near Gurgaon, famous for boating, camping, and adventure activities.",
    map: "https://www.google.com/maps/place/Damdama+Lake,+Haryana",
    hotels: [
      { name: "The Gateway Resort Damdama", map: "https://www.google.com/maps/search/The+Gateway+Resort+Damdama" },
      { name: "Botanix Nature Resort", map: "https://www.google.com/maps/search/Botanix+Nature+Resort+Damdama" }
    ]
  },
  {
    name: "Panipat",
    description: "Historic battlefield city with museums and forts, known for textiles.",
    map: "https://www.google.com/maps/place/Panipat,+Haryana",
    hotels: [
      { name: "Hotel Hive Panipat", map: "https://www.google.com/maps/search/Hotel+Hive+Panipat" },
      { name: "Days Hotel Panipat", map: "https://www.google.com/maps/search/Days+Hotel+Panipat" }
    ]
  },
  {
    name: "Karna Lake, Karnal",
    description: "Beautiful lake named after Karna from Mahabharata — ideal for boating and picnics.",
    map: "https://www.google.com/maps/place/Karna+Lake,+Karnal",
    hotels: [
      { name: "Noormahal Palace Hotel", map: "https://www.google.com/maps/search/Noormahal+Palace+Hotel+Karnal" },
      { name: "Hotel Vivaan", map: "https://www.google.com/maps/search/Hotel+Vivaan+Karnal" }
    ]
  }
],
assam: [
  {
    name: "Kaziranga National Park",
    description: "UNESCO World Heritage site famous for one-horned rhinoceroses and elephant safaris.",
    map: "https://www.google.com/maps/place/Kaziranga+National+Park,+Assam",
    hotels: [
      { name: "IORA The Retreat", map: "https://www.google.com/maps/search/IORA+The+Retreat+Kaziranga" },
      { name: "Resort Borgos", map: "https://www.google.com/maps/search/Resort+Borgos+Kaziranga" }
    ]
  },
  {
    name: "Majuli Island",
    description: "World’s largest river island, known for Satras (monasteries) and Assamese culture.",
    map: "https://www.google.com/maps/place/Majuli,+Assam",
    hotels: [
      { name: "La Maison de Ananda", map: "https://www.google.com/maps/search/La+Maison+de+Ananda+Majuli" },
      { name: "Dekasang Majuli", map: "https://www.google.com/maps/search/Dekasang+Majuli" }
    ]
  },
  {
    name: "Kamakhya Temple",
    description: "Ancient temple dedicated to Goddess Kamakhya on Nilachal Hill, Guwahati.",
    map: "https://www.google.com/maps/place/Kamakhya+Temple,+Guwahati",
    hotels: [
      { name: "Radisson Blu Guwahati", map: "https://www.google.com/maps/search/Radisson+Blu+Guwahati" },
      { name: "Hotel Prag Continental", map: "https://www.google.com/maps/search/Hotel+Prag+Continental+Guwahati" }
    ]
  },
  {
    name: "Manas National Park",
    description: "Tiger reserve and biosphere sanctuary located at the foothills of the Himalayas.",
    map: "https://www.google.com/maps/place/Manas+National+Park,+Assam",
    hotels: [
      { name: "Florican Cottages", map: "https://www.google.com/maps/search/Florican+Cottages+Manas" },
      { name: "Bansbari Lodge", map: "https://www.google.com/maps/search/Bansbari+Lodge+Manas" }
    ]
  },
  {
    name: "Sivasagar",
    description: "Historical town featuring Ahom-era temples, palaces, and tanks.",
    map: "https://www.google.com/maps/place/Sivasagar,+Assam",
    hotels: [
      { name: "Hotel Piccolo", map: "https://www.google.com/maps/search/Hotel+Piccolo+Sivasagar" },
      { name: "Hotel Brahmaputra", map: "https://www.google.com/maps/search/Hotel+Brahmaputra+Sivasagar" }
    ]
  },
  {
    name: "Haflong",
    description: "Known as the ‘Switzerland of the East’, a serene hill station with blue hills and lakes.",
    map: "https://www.google.com/maps/place/Haflong,+Assam",
    hotels: [
      { name: "Hotel Landmark Royale", map: "https://www.google.com/maps/search/Hotel+Landmark+Royale+Haflong" },
      { name: "Nothao Hillside Retreat", map: "https://www.google.com/maps/search/Nothao+Hillside+Retreat+Haflong" }
    ]
  },
  {
    name: "Umananda Island",
    description: "Small island temple in the Brahmaputra River, dedicated to Lord Shiva.",
    map: "https://www.google.com/maps/place/Umananda+Temple,+Guwahati",
    hotels: [
      { name: "Vivanta Guwahati", map: "https://www.google.com/maps/search/Vivanta+Guwahati" },
      { name: "Hotel Gateway Grandeur", map: "https://www.google.com/maps/search/Hotel+Gateway+Grandeur+Guwahati" }
    ]
  }
],
meghalaya: [
  {
    name: "Cherrapunji (Sohra)",
    description: "One of the wettest places on Earth, famous for waterfalls like Nohkalikai and Mawsmai Caves.",
    map: "https://www.google.com/maps/place/Cherrapunji,+Meghalaya",
    hotels: [
      { name: "Pala Resort", map: "https://www.google.com/maps/search/Pala+Resort+Cherrapunji" },
      { name: "Polo Orchid Resort", map: "https://www.google.com/maps/search/Polo+Orchid+Resort+Cherrapunji" }
    ]
  },
  {
    name: "Shillong",
    description: "The Scotland of the East — known for its colonial charm, lakes, and music scene.",
    map: "https://www.google.com/maps/place/Shillong,+Meghalaya",
    hotels: [
      { name: "Hotel Polo Towers", map: "https://www.google.com/maps/search/Hotel+Polo+Towers+Shillong" },
      { name: "Ri Kynjai Serenity by The Lake", map: "https://www.google.com/maps/search/Ri+Kynjai+Shillong" }
    ]
  },
  {
    name: "Dawki",
    description: "Crystal-clear Umngot River offering boating between India and Bangladesh border.",
    map: "https://www.google.com/maps/place/Dawki,+Meghalaya",
    hotels: [
      { name: "Shnongpdeng Riverside Camps", map: "https://www.google.com/maps/search/Shnongpdeng+Riverside+Camps" },
      { name: "Bistro by the Lake", map: "https://www.google.com/maps/search/Bistro+by+the+Lake+Dawki" }
    ]
  },
  {
    name: "Mawlynnong Village",
    description: "Asia’s cleanest village with bamboo walkways and a living root bridge.",
    map: "https://www.google.com/maps/place/Mawlynnong,+Meghalaya",
    hotels: [
      { name: "Mawlynnong Guest House", map: "https://www.google.com/maps/search/Mawlynnong+Guest+House" },
      { name: "Nongriat Homestay", map: "https://www.google.com/maps/search/Nongriat+Homestay" }
    ]
  },
  {
    name: "Mawsynram",
    description: "The rainiest place in the world, known for caves and lush green landscapes.",
    map: "https://www.google.com/maps/place/Mawsynram,+Meghalaya",
    hotels: [
      { name: "Apsara Guest House", map: "https://www.google.com/maps/search/Apsara+Guest+House+Mawsynram" },
      { name: "Mawsynram Eco Resort", map: "https://www.google.com/maps/search/Mawsynram+Eco+Resort" }
    ]
  },
  {
    name: "Laitlum Canyons",
    description: "Spectacular canyon viewpoint near Shillong, perfect for trekking and photography.",
    map: "https://www.google.com/maps/place/Laitlum+Canyons,+Meghalaya",
    hotels: [
      { name: "Silver Brook Homestay", map: "https://www.google.com/maps/search/Silver+Brook+Homestay+Shillong" },
      { name: "Roinam Retreat", map: "https://www.google.com/maps/search/Roinam+Retreat+Shillong" }
    ]
  },
  {
    name: "Nongkhnum Island",
    description: "Second largest river island in Asia with sandy beaches and river scenery.",
    map: "https://www.google.com/maps/place/Nongkhnum+Island,+Meghalaya",
    hotels: [
      { name: "Kynshi River Camp", map: "https://www.google.com/maps/search/Kynshi+River+Camp+Nongkhnum" },
      { name: "West Khasi Hills Homestay", map: "https://www.google.com/maps/search/West+Khasi+Hills+Homestay" }
    ]
  }
],
arunachalPradesh: [
  {
    name: "Tawang Monastery",
    description: "India’s largest monastery and a sacred Tibetan Buddhist site overlooking the Tawang Valley.",
    map: "https://www.google.com/maps/place/Tawang+Monastery,+Arunachal+Pradesh",
    hotels: [
      { name: "Hotel Gakyi Khang Zhang", map: "https://www.google.com/maps/search/Hotel+Gakyi+Khang+Zhang+Tawang" },
      { name: "Dondrub Homestay", map: "https://www.google.com/maps/search/Dondrub+Homestay+Tawang" }
    ]
  },
  {
    name: "Sela Pass",
    description: "A breathtaking high-altitude pass with a turquoise lake, often snow-covered through the year.",
    map: "https://www.google.com/maps/place/Sela+Pass,+Arunachal+Pradesh",
    hotels: [
      { name: "Blue Pine Camp", map: "https://www.google.com/maps/search/Blue+Pine+Camp+Sela+Pass" },
      { name: "Tawang View Hotel", map: "https://www.google.com/maps/search/Tawang+View+Hotel" }
    ]
  },
  {
    name: "Ziro Valley",
    description: "Famous for Ziro Music Festival, lush paddy fields, and Apatani tribal villages.",
    map: "https://www.google.com/maps/place/Ziro+Valley,+Arunachal+Pradesh",
    hotels: [
      { name: "Siiro Resort", map: "https://www.google.com/maps/search/Siiro+Resort+Ziro" },
      { name: "Abasa Homestay", map: "https://www.google.com/maps/search/Abasa+Homestay+Ziro" }
    ]
  },
  {
    name: "Namdapha National Park",
    description: "India’s third largest national park with red pandas, tigers, and diverse wildlife.",
    map: "https://www.google.com/maps/place/Namdapha+National+Park,+Arunachal+Pradesh",
    hotels: [
      { name: "Deban Forest Guest House", map: "https://www.google.com/maps/search/Deban+Forest+Guest+House+Namdapha" },
      { name: "Miao Guest House", map: "https://www.google.com/maps/search/Miao+Guest+House+Arunachal" }
    ]
  },
  {
    name: "Bomdila Monastery",
    description: "A serene Buddhist monastery with panoramic views of the Himalayas.",
    map: "https://www.google.com/maps/place/Bomdila+Monastery,+Arunachal+Pradesh",
    hotels: [
      { name: "Hotel Tsepal Yangjom", map: "https://www.google.com/maps/search/Hotel+Tsepal+Yangjom+Bomdila" },
      { name: "Apple Orchard Resort", map: "https://www.google.com/maps/search/Apple+Orchard+Resort+Bomdila" }
    ]
  },
  {
    name: "Dirang Valley",
    description: "A picturesque valley with hot water springs, orchards, and monasteries.",
    map: "https://www.google.com/maps/place/Dirang,+Arunachal+Pradesh",
    hotels: [
      { name: "Awoo Resort", map: "https://www.google.com/maps/search/Awoo+Resort+Dirang" },
      { name: "Pemaling Hotel", map: "https://www.google.com/maps/search/Pemaling+Hotel+Dirang" }
    ]
  },
  {
    name: "Itanagar",
    description: "The capital city known for Ita Fort, Ganga Lake, and Buddhist temples.",
    map: "https://www.google.com/maps/place/Itanagar,+Arunachal+Pradesh",
    hotels: [
      { name: "Hotel Pybss", map: "https://www.google.com/maps/search/Hotel+Pybss+Itanagar" },
      { name: "Donyi Polo Ashok", map: "https://www.google.com/maps/search/Donyi+Polo+Ashok+Itanagar" }
    ]
  }
],
assam: [
  {
    name: "Kaziranga National Park",
    description: "UNESCO World Heritage Site known for the one-horned rhinoceros and rich biodiversity.",
    map: "https://www.google.com/maps/place/Kaziranga+National+Park,+Assam",
    hotels: [
      { name: "IORA - The Retreat", map: "https://www.google.com/maps/search/IORA+The+Retreat+Kaziranga" },
      { name: "Diphlu River Lodge", map: "https://www.google.com/maps/search/Diphlu+River+Lodge" }
    ]
  },
  {
    name: "Kamakhya Temple",
    description: "Ancient Hindu temple dedicated to Goddess Kamakhya, located on Nilachal Hill in Guwahati.",
    map: "https://www.google.com/maps/place/Kamakhya+Temple,+Guwahati",
    hotels: [
      { name: "Vivanta Guwahati", map: "https://www.google.com/maps/search/Vivanta+Guwahati" },
      { name: "Radisson Blu Hotel Guwahati", map: "https://www.google.com/maps/search/Radisson+Blu+Hotel+Guwahati" }
    ]
  },
  {
    name: "Majuli Island",
    description: "World’s largest river island known for its monasteries (Satras) and vibrant culture.",
    map: "https://www.google.com/maps/place/Majuli,+Assam",
    hotels: [
      { name: "La Maison de Ananda", map: "https://www.google.com/maps/search/La+Maison+de+Ananda+Majuli" },
      { name: "Mishing Village Homestay", map: "https://www.google.com/maps/search/Mishing+Village+Homestay+Majuli" }
    ]
  },
  {
    name: "Manas National Park",
    description: "Biosphere Reserve and UNESCO site located at the foothills of the Himalayas.",
    map: "https://www.google.com/maps/place/Manas+National+Park,+Assam",
    hotels: [
      { name: "Bansbari Lodge", map: "https://www.google.com/maps/search/Bansbari+Lodge+Manas" },
      { name: "Florican Cottages", map: "https://www.google.com/maps/search/Florican+Cottages+Manas" }
    ]
  },
  {
    name: "Sivasagar",
    description: "Historic town that was the capital of the Ahom kingdom, featuring temples and tanks.",
    map: "https://www.google.com/maps/place/Sivasagar,+Assam",
    hotels: [
      { name: "Hotel Piccolo", map: "https://www.google.com/maps/search/Hotel+Piccolo+Sivasagar" },
      { name: "Hotel Shiva Palace", map: "https://www.google.com/maps/search/Hotel+Shiva+Palace+Sivasagar" }
    ]
  },
  {
    name: "Haflong",
    description: "Assam’s only hill station known for lakes, bamboo groves, and tribal culture.",
    map: "https://www.google.com/maps/place/Haflong,+Assam",
    hotels: [
      { name: "Circuit House Haflong", map: "https://www.google.com/maps/search/Circuit+House+Haflong" },
      { name: "Landmark Hotel Haflong", map: "https://www.google.com/maps/search/Landmark+Hotel+Haflong" }
    ]
  },
  {
    name: "Tocklai Tea Research Centre (Jorhat)",
    description: "Asia’s oldest tea research center surrounded by lush tea gardens.",
    map: "https://www.google.com/maps/place/Tocklai+Tea+Research+Institute,+Jorhat",
    hotels: [
      { name: "Hotel Heritage Jorhat", map: "https://www.google.com/maps/search/Hotel+Heritage+Jorhat" },
      { name: "Hotel MD’s Continental", map: "https://www.google.com/maps/search/Hotel+MD’s+Continental+Jorhat" }
    ]
  }
],
sikkim: [
  {
    name: "Gangtok",
    description: "The capital city of Sikkim, known for its monasteries, MG Marg, and Himalayan views.",
    map: "https://www.google.com/maps/place/Gangtok,+Sikkim",
    hotels: [
      { name: "Mayfair Spa Resort & Casino", map: "https://www.google.com/maps/search/Mayfair+Spa+Resort+%26+Casino+Gangtok" },
      { name: "The Elgin Nor-Khill", map: "https://www.google.com/maps/search/The+Elgin+Nor-Khill+Gangtok" }
    ]
  },
  {
    name: "Tsomgo Lake (Changu Lake)",
    description: "Glacial lake located at 12,400 ft, surrounded by snow-clad mountains.",
    map: "https://www.google.com/maps/place/Tsomgo+Lake,+Sikkim",
    hotels: [
      { name: "Summit Norling Resort", map: "https://www.google.com/maps/search/Summit+Norling+Resort+Gangtok" },
      { name: "Hotel Sonam Delek", map: "https://www.google.com/maps/search/Hotel+Sonam+Delek+Gangtok" }
    ]
  },
  {
    name: "Nathula Pass",
    description: "Mountain pass on the Indo-China border offering stunning Himalayan views.",
    map: "https://www.google.com/maps/place/Nathula+Pass,+Sikkim",
    hotels: [
      { name: "Denzong Regency", map: "https://www.google.com/maps/search/Denzong+Regency+Gangtok" },
      { name: "Netuk House", map: "https://www.google.com/maps/search/Netuk+House+Gangtok" }
    ]
  },
  {
    name: "Rumtek Monastery",
    description: "One of the most important monasteries in Sikkim, seat of the Karmapa Lama.",
    map: "https://www.google.com/maps/place/Rumtek+Monastery,+Sikkim",
    hotels: [
      { name: "Saramsa Resort", map: "https://www.google.com/maps/search/Saramsa+Resort+Gangtok" },
      { name: "Delight The Fortuna", map: "https://www.google.com/maps/search/Delight+The+Fortuna+Gangtok" }
    ]
  },
  {
    name: "Pelling",
    description: "Hill town famous for views of Kanchenjunga and Pemayangtse Monastery.",
    map: "https://www.google.com/maps/place/Pelling,+Sikkim",
    hotels: [
      { name: "The Elgin Mount Pandim", map: "https://www.google.com/maps/search/The+Elgin+Mount+Pandim+Pelling" },
      { name: "Summit Newa Regency", map: "https://www.google.com/maps/search/Summit+Newa+Regency+Pelling" }
    ]
  },
  {
    name: "Lachung & Yumthang Valley",
    description: "Known as the Valley of Flowers, famous for rhododendrons and snow in winter.",
    map: "https://www.google.com/maps/place/Yumthang+Valley,+Sikkim",
    hotels: [
      { name: "Apple Valley Inn Lachung", map: "https://www.google.com/maps/search/Apple+Valley+Inn+Lachung" },
      { name: "Yarlam Resort Lachung", map: "https://www.google.com/maps/search/Yarlam+Resort+Lachung" }
    ]
  },
  {
    name: "Zuluk",
    description: "Small village on the historic Old Silk Route offering panoramic mountain views.",
    map: "https://www.google.com/maps/place/Zuluk,+Sikkim",
    hotels: [
      { name: "Zuluk Eco Retreat", map: "https://www.google.com/maps/search/Zuluk+Eco+Retreat" },
      { name: "Phamlok Homestay", map: "https://www.google.com/maps/search/Phamlok+Homestay+Zuluk" }
    ]
  }
],
nagaland: [
  {
    name: "Kohima",
    description: "Capital city known for World War II Cemetery, Naga Heritage Village, and the Hornbill Festival.",
    map: "https://www.google.com/maps/place/Kohima,+Nagaland",
    hotels: [
      { name: "Hotel Japfu", map: "https://www.google.com/maps/search/Hotel+Japfu+Kohima" },
      { name: "De Oriental Grand", map: "https://www.google.com/maps/search/De+Oriental+Grand+Kohima" }
    ]
  },
  {
    name: "Dimapur",
    description: "Gateway to Nagaland, known for ruins of the Kachari Kingdom and local bazaars.",
    map: "https://www.google.com/maps/place/Dimapur,+Nagaland",
    hotels: [
      { name: "Hotel Acacia", map: "https://www.google.com/maps/search/Hotel+Acacia+Dimapur" },
      { name: "Niathu Resort", map: "https://www.google.com/maps/search/Niathu+Resort+Dimapur" }
    ]
  },
  {
    name: "Dzükou Valley",
    description: "Spectacular valley known for its rolling green hills and seasonal flowers.",
    map: "https://www.google.com/maps/place/Dzukou+Valley",
    hotels: [
      { name: "Dzukou Valley Guest House", map: "https://www.google.com/maps/search/Dzukou+Valley+Guest+House" },
      { name: "Nearby Homestays", map: "https://www.google.com/maps/search/homestays+near+Dzukou+Valley" }
    ]
  },
  {
    name: "Mon Village",
    description: "Cultural village of the Konyak tribe, famous for headhunter history and traditional tattoos.",
    map: "https://www.google.com/maps/place/Mon,+Nagaland",
    hotels: [
      { name: "Mon Heritage Lodge", map: "https://www.google.com/maps/search/Mon+Heritage+Lodge" },
      { name: "Mon Tourist Lodge", map: "https://www.google.com/maps/search/Mon+Tourist+Lodge" }
    ]
  },
  {
    name: "Tuophema Village",
    description: "Model village promoting eco-tourism and Naga culture with traditional huts.",
    map: "https://www.google.com/maps/place/Tuophema,+Nagaland",
    hotels: [
      { name: "Tuophema Tourist Village Huts", map: "https://www.google.com/maps/search/Tuophema+Tourist+Village" },
      { name: "Nearby Homestays", map: "https://www.google.com/maps/search/homestays+near+Tuophema" }
    ]
  },
  {
    name: "Mokokchung",
    description: "Cultural hub of the Ao tribe, known for its festivals and scenic hills.",
    map: "https://www.google.com/maps/place/Mokokchung,+Nagaland",
    hotels: [
      { name: "Circuit House Mokokchung", map: "https://www.google.com/maps/search/Circuit+House+Mokokchung" },
      { name: "Hotel Metsuben", map: "https://www.google.com/maps/search/Hotel+Metsuben+Mokokchung" }
    ]
  },
  {
    name: "Wokha",
    description: "Town known for Mount Tiyi, Lotha tribe culture, and orange orchards.",
    map: "https://www.google.com/maps/place/Wokha,+Nagaland",
    hotels: [
      { name: "Hotel Mount Tiyi", map: "https://www.google.com/maps/search/Hotel+Mount+Tiyi+Wokha" },
      { name: "Nearby Guest Houses", map: "https://www.google.com/maps/search/guest+houses+near+Wokha" }
    ]
  }
],
manipur: [
  {
    name: "Loktak Lake",
    description: "Largest freshwater lake in northeast India, famous for its floating phumdis and the Keibul Lamjao National Park.",
    map: "https://www.google.com/maps/place/Loktak+Lake,+Manipur",
    hotels: [
      { name: "Sendra Park & Resort", map: "https://www.google.com/maps/search/Sendra+Park+%26+Resort+Loktak" },
      { name: "Loktak Lakeview Homestay", map: "https://www.google.com/maps/search/Loktak+Lakeview+Homestay" }
    ]
  },
  {
    name: "Imphal",
    description: "Capital city with Kangla Fort, Ima Keithel (women’s market), and Manipur State Museum.",
    map: "https://www.google.com/maps/place/Imphal,+Manipur",
    hotels: [
      { name: "Classic Grande Imphal", map: "https://www.google.com/maps/search/Classic+Grande+Imphal" },
      { name: "The Sangai Continental", map: "https://www.google.com/maps/search/The+Sangai+Continental+Imphal" }
    ]
  },
  {
    name: "Keibul Lamjao National Park",
    description: "World’s only floating national park, home to the endangered Sangai deer.",
    map: "https://www.google.com/maps/place/Keibul+Lamjao+National+Park",
    hotels: [
      { name: "Sendra Resort", map: "https://www.google.com/maps/search/Sendra+Resort+Manipur" },
      { name: "Nearby Eco Lodges", map: "https://www.google.com/maps/search/eco+lodges+near+Keibul+Lamjao" }
    ]
  },
  {
    name: "Kangla Fort",
    description: "Ancient royal palace and fort complex with historical and cultural significance.",
    map: "https://www.google.com/maps/place/Kangla+Fort,+Imphal",
    hotels: [
      { name: "Hotel Imphal by The Classic", map: "https://www.google.com/maps/search/Hotel+Imphal+by+The+Classic" },
      { name: "Hotel Yaiphaba", map: "https://www.google.com/maps/search/Hotel+Yaiphaba+Imphal" }
    ]
  },
  {
    name: "Ukhrul",
    description: "Hill town known for Shiroi Hills, Shirui Lily, and Tangkhul Naga culture.",
    map: "https://www.google.com/maps/place/Ukhrul,+Manipur",
    hotels: [
      { name: "Shirui Lily Inn", map: "https://www.google.com/maps/search/Shirui+Lily+Inn+Ukhrul" },
      { name: "Ukhrul Tourist Lodge", map: "https://www.google.com/maps/search/Ukhrul+Tourist+Lodge" }
    ]
  },
  {
    name: "Moreh",
    description: "Border town near Myanmar, known for trade and Indo-Myanmar Friendship Gate.",
    map: "https://www.google.com/maps/place/Moreh,+Manipur",
    hotels: [
      { name: "Hotel Hillview Moreh", map: "https://www.google.com/maps/search/Hotel+Hillview+Moreh" },
      { name: "Nearby Lodges", map: "https://www.google.com/maps/search/lodges+near+Moreh" }
    ]
  },
  {
    name: "Andro Village",
    description: "Cultural village showcasing traditional pottery, art, and museum of Manipuri heritage.",
    map: "https://www.google.com/maps/place/Andro,+Manipur",
    hotels: [
      { name: "Andro Heritage Cottages", map: "https://www.google.com/maps/search/Andro+Heritage+Cottages" },
      { name: "Nearby Homestays", map: "https://www.google.com/maps/search/homestays+near+Andro" }
    ]
  }
],
mizoram: [
  {
    name: "Aizawl",
    description: "The capital city known for its scenic beauty, cultural centers, and vibrant local markets.",
    map: "https://www.google.com/maps/place/Aizawl,+Mizoram",
    hotels: [
      { name: "Hotel Regency Aizawl", map: "https://www.google.com/maps/search/Hotel+Regency+Aizawl" },
      { name: "The Grand Hotel Mizoram", map: "https://www.google.com/maps/search/The+Grand+Hotel+Aizawl" }
    ]
  },
  {
    name: "Reiek",
    description: "Hill village near Aizawl offering panoramic views, heritage huts, and trekking trails.",
    map: "https://www.google.com/maps/place/Reiek,+Mizoram",
    hotels: [
      { name: "Reiek Tourist Resort", map: "https://www.google.com/maps/search/Reiek+Tourist+Resort" },
      { name: "Homestays in Reiek", map: "https://www.google.com/maps/search/homestays+in+Reiek" }
    ]
  },
  {
    name: "Vantawng Falls",
    description: "Highest and most spectacular waterfall in Mizoram, surrounded by dense forests.",
    map: "https://www.google.com/maps/place/Vantawng+Falls,+Mizoram",
    hotels: [
      { name: "Hotel Chaltlang Tourist Lodge", map: "https://www.google.com/maps/search/Hotel+Chaltlang+Tourist+Lodge" },
      { name: "Nearby Lodges", map: "https://www.google.com/maps/search/lodges+near+Vantawng+Falls" }
    ]
  },
  {
    name: "Tam Dil Lake",
    description: "Serene natural lake surrounded by forest — ideal for boating and picnics.",
    map: "https://www.google.com/maps/place/Tam+Dil,+Mizoram",
    hotels: [
      { name: "Tam Dil Tourist Lodge", map: "https://www.google.com/maps/search/Tam+Dil+Tourist+Lodge" },
      { name: "Nearby Guest Houses", map: "https://www.google.com/maps/search/guest+houses+near+Tam+Dil" }
    ]
  },
  {
    name: "Phawngpui (Blue Mountain) National Park",
    description: "Highest peak in Mizoram, famous for orchids, butterflies, and scenic treks.",
    map: "https://www.google.com/maps/place/Phawngpui+National+Park",
    hotels: [
      { name: "Phawngpui Eco Lodge", map: "https://www.google.com/maps/search/Phawngpui+Eco+Lodge" },
      { name: "Nearby Camps", map: "https://www.google.com/maps/search/camps+near+Phawngpui" }
    ]
  },
  {
    name: "Hmuifang",
    description: "Picturesque mountain with viewpoints, meadows, and traditional villages.",
    map: "https://www.google.com/maps/place/Hmuifang,+Mizoram",
    hotels: [
      { name: "Hmuifang Tourist Resort", map: "https://www.google.com/maps/search/Hmuifang+Tourist+Resort" },
      { name: "Homestays in Hmuifang", map: "https://www.google.com/maps/search/homestays+in+Hmuifang" }
    ]
  },
  {
    name: "Lunglei",
    description: "Second-largest town in Mizoram known for its church architecture and viewpoints.",
    map: "https://www.google.com/maps/place/Lunglei,+Mizoram",
    hotels: [
      { name: "Hotel Elite Lunglei", map: "https://www.google.com/maps/search/Hotel+Elite+Lunglei" },
      { name: "Tourist Lodge Lunglei", map: "https://www.google.com/maps/search/Tourist+Lodge+Lunglei" }
    ]
  }
],
tripura: [
  {
    name: "Ujjayanta Palace",
    description: "Magnificent royal palace in Agartala, now serving as a state museum.",
    map: "https://www.google.com/maps/place/Ujjayanta+Palace,+Agartala",
    hotels: [
      { name: "Ginger Hotel Agartala", map: "https://www.google.com/maps/search/Ginger+Hotel+Agartala" },
      { name: "Hotel Sonar Tori", map: "https://www.google.com/maps/search/Hotel+Sonar+Tori+Agartala" }
    ]
  },
  {
    name: "Neermahal Palace",
    description: "A stunning water palace built in the middle of Rudrasagar Lake, blending Hindu and Mughal styles.",
    map: "https://www.google.com/maps/place/Neermahal,+Tripura",
    hotels: [
      { name: "Sagarmahal Tourist Lodge", map: "https://www.google.com/maps/search/Sagarmahal+Tourist+Lodge+Tripura" },
      { name: "Nearby Stay Options", map: "https://www.google.com/maps/search/hotels+near+Neermahal" }
    ]
  },
  {
    name: "Unakoti Hills",
    description: "Archaeological site with thousands of rock-cut sculptures and ancient carvings.",
    map: "https://www.google.com/maps/place/Unakoti,+Tripura",
    hotels: [
      { name: "Unakoti Tourist Lodge", map: "https://www.google.com/maps/search/Unakoti+Tourist+Lodge" },
      { name: "Nearby Lodges", map: "https://www.google.com/maps/search/hotels+near+Unakoti" }
    ]
  },
  {
    name: "Jampui Hills",
    description: "Scenic hill station known for orange orchards and breathtaking sunrise views.",
    map: "https://www.google.com/maps/place/Jampui+Hills,+Tripura",
    hotels: [
      { name: "Eden Tourist Lodge", map: "https://www.google.com/maps/search/Eden+Tourist+Lodge+Jampui" },
      { name: "Nearby Homestays", map: "https://www.google.com/maps/search/homestays+in+Jampui+Hills" }
    ]
  },
  {
    name: "Sepahijala Wildlife Sanctuary",
    description: "Nature reserve featuring lakes, boating, and diverse wildlife including primates.",
    map: "https://www.google.com/maps/place/Sepahijala+Wildlife+Sanctuary",
    hotels: [
      { name: "Forest Guest House", map: "https://www.google.com/maps/search/Forest+Guest+House+Sepahijala" },
      { name: "Nearby Hotels", map: "https://www.google.com/maps/search/hotels+near+Sepahijala+Wildlife+Sanctuary" }
    ]
  },
  {
    name: "Tripura Sundari Temple (Matabari)",
    description: "One of the 51 Shakti Peethas, this temple is a major pilgrimage site near Udaipur.",
    map: "https://www.google.com/maps/place/Tripura+Sundari+Temple,+Udaipur,+Tripura",
    hotels: [
      { name: "Udaipur Tourist Lodge", map: "https://www.google.com/maps/search/Udaipur+Tourist+Lodge+Tripura" },
      { name: "Nearby Lodging", map: "https://www.google.com/maps/search/hotels+near+Tripura+Sundari+Temple" }
    ]
  },
  {
    name: "Rudrasagar Lake",
    description: "Beautiful lake surrounding Neermahal Palace, ideal for boating and birdwatching.",
    map: "https://www.google.com/maps/place/Rudrasagar+Lake,+Tripura",
    hotels: [
      { name: "Sagarmahal Tourist Lodge", map: "https://www.google.com/maps/search/Sagarmahal+Tourist+Lodge" },
      { name: "Nearby Stay Options", map: "https://www.google.com/maps/search/hotels+near+Rudrasagar+Lake" }
    ]
  }
]
  };

  // --- SEARCH FUNCTIONALITY ---
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", function () {
      const raw = this.value.trim().toLowerCase();
      // Normalize a couple common variants (optional)
      const key = raw.replace(/\s+/g, " ").trim(); // collapse spaces
      searchResults.innerHTML = "";

      if (!key) return;

      // Try exact key first, then try simple fuzzy match (startsWith)
      const exact = destinations[key];
      let found = [];

      if (exact) {
        found = exact;
      } else {
        // fuzzy search by state key: match keys that contain the typed text
        const matchedKeys = Object.keys(destinations).filter(k => k.indexOf(key) !== -1 || k.replace(/\s+/g, "").indexOf(key.replace(/\s+/g, "")) !== -1);
        matchedKeys.forEach(k => found = found.concat(destinations[k]));
      }

      if (found.length === 0) {
        searchResults.innerHTML = `<p>No destinations found for "${this.value}". Try "goa", "kerala", or "tamil nadu".</p>`;
        return;
      }

      // build cards
      found.forEach(place => {
        const card = document.createElement("div");
        card.className = "destination-card";
        card.innerHTML = `
  <h3>${place.name}</h3>
  <p>${place.description}</p>
  <a href="${place.map}" target="_blank">📍 View on Map</a>
  <div class="hotels">
    <h4>🏨 Nearby Hotels & Resorts:</h4>
    <ul>
      ${place.hotels.map(hotel => `
        <li><a href="${hotel.map}" target="_blank">${hotel.name}</a></li>
      `).join('')}
    </ul>
  </div>
`;
card.innerHTML += `<button class="addTripBtn">Add to My Trips</button>`;

        // small inline styling improvements (can be moved to CSS)
        const img = card.querySelector("img");
        if (img) {
          img.style.width = "100%";
          img.style.height = "200px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
        }
        card.style.margin = "10px";
        card.style.padding = "12px";
        card.style.borderRadius = "12px";
        card.style.background = "rgba(255,255,255,0.95)";
        card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        card.style.width = "300px";
        card.style.textAlign = "center";

        searchResults.appendChild(card);
      });
    });
  }

  // --- ADD TO MY TRIPS (click delegation) ---

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addTripBtn")) {
    const card = e.target.closest(".destination-card");
    if (!card) return;

    const name = card.querySelector("h3, h4")?.textContent || "Unknown";
    const desc = card.querySelector("p")?.textContent || "";
    const mapLink = card.querySelector("a[href*='maps']")?.href || "";

    // collect hotels
    const hotelsList = [];
    card.querySelectorAll(".hotels ul li a").forEach(h =>
      hotelsList.push({ name: h.textContent, map: h.href })
    );

    const trip = { name, description: desc, map: mapLink, hotels: hotelsList };
    const trips = JSON.parse(localStorage.getItem("myTrips")) || [];
    trips.push(trip);
    localStorage.setItem("myTrips", JSON.stringify(trips));
    alert(`${trip.name} added to your trips!`);
  }
});
// --- REMOVE FROM MY TRIPS ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeTripBtn")) {
    const card = e.target.closest(".destination-card");
    if (!card) return;
    const name = card.querySelector("h3, h4")?.textContent;

    let trips = JSON.parse(localStorage.getItem("myTrips")) || [];
    trips = trips.filter(t => t.name !== name);

    localStorage.setItem("myTrips", JSON.stringify(trips));
    alert(`${name} removed from your trips!`);
    showMyTrips(); // refresh the view instantly
  }
});


  // --- SHOW MY TRIPS ---
  function showMyTrips() {
    if (!myTripsSection) return;
    const trips = JSON.parse(localStorage.getItem("myTrips")) || [];
    // Preserve any profile panel or other sections; set content of myTripsSection
    myTripsSection.innerHTML = "<h3>Your Saved Trips</h3>";

    if (trips.length === 0) {
      myTripsSection.innerHTML += "<p>No trips added yet.</p>";
      return;
    }

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.padding = "10px";
    container.style.maxHeight = "70vh";
    container.style.overflowY = "auto";

    trips.forEach(trip => {
      const card = document.createElement("div");
  card.className = "destination-card";
  card.innerHTML = `
    <h3>${trip.name}</h3>
    <p>${trip.description}</p>
    <a href="${trip.map}" target="_blank">📍 View on Map</a>
    <div class="hotels">
      <h4>🏨 Nearby Hotels & Resorts:</h4>
      <ul>
        ${trip.hotels && trip.hotels.length
          ? trip.hotels.map(h => `<li><a href="${h.map}" target="_blank">${h.name}</a></li>`).join('')
          : '<li>No hotels available</li>'
        }
      </ul>
    </div>
  `;
    card.innerHTML += `<button class="removeTripBtn">❌ Remove</button>`;

  card.style.width = "300px";
  card.style.padding = "12px";
  card.style.borderRadius = "10px";
  card.style.background = "rgba(255,255,255,0.95)";
  card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
  container.appendChild(card);
    });

    myTripsSection.appendChild(container);
  }

  // expose showMyTrips to global if other code calls it
  window.showMyTrips = showMyTrips;

  // End of DOMContentLoaded
});
