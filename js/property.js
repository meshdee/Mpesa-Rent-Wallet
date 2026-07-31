// ===========================================
// M-PESA Rent Wallet
// Property Module (Version 10.0)
// ===========================================
console.log("✅ Property Module Version 10 Loaded");
const createPropertyBtn = document.getElementById("createPropertyBtn");

const propertyName = document.getElementById("propertyName");
const propertyLocation = document.getElementById("propertyLocation");
const propertyUnits = document.getElementById("propertyUnits");
const monthlyRent = document.getElementById("monthlyRent");

const propertiesTableBody =
    document.getElementById("propertiesTableBody");

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    // If this page doesn't contain the property table,
    // don't execute the rest of the script.
    if (!propertiesTableBody) return;

    try {

        const response = await fetch("/api/properties");

        const properties = await response.json();

        propertiesTableBody.innerHTML = "";

        if (!Array.isArray(properties) || properties.length === 0) {

            propertiesTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No properties registered.
                    </td>
                </tr>
            `;

            return;
        }

        properties.forEach(property => {

            propertiesTableBody.innerHTML += `
                <tr>
                    <td>${property.propertyCode || "-"}</td>
                    <td>${property.propertyName || "-"}</td>
                    <td>${property.location || "-"}</td>
                    <td>${property.units || 0}</td>
                    <td>KES ${Number(property.monthlyRent || 0).toLocaleString()}</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error("Failed to load properties:", error);

    }

}

// ===========================================
// Create Property
// ===========================================

if (createPropertyBtn) {

    createPropertyBtn.addEventListener("click", async () => {

        try {

            const data = {

                propertyName: propertyName ? propertyName.value.trim() : "",

                location: propertyLocation ? propertyLocation.value.trim() : "",

                units: Number(propertyUnits ? propertyUnits.value : 0),

                monthlyRent: Number(monthlyRent ? monthlyRent.value : 0)

            };

            const response = await fetch("/api/properties", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            alert(result.message);

            if (propertyName) propertyName.value = "";
            if (propertyLocation) propertyLocation.value = "";
            if (propertyUnits) propertyUnits.value = "";
            if (monthlyRent) monthlyRent.value = "";

            loadProperties();

        }

        catch (error) {

            console.error(error);

            alert("Unable to create property.");

        }

    });

}

// ===========================================
// Initialize
// ===========================================

loadProperties();