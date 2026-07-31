// ===========================================
// M-PESA Rent Wallet
// Property Module (Version 9.5)
// ===========================================

// Buttons
const createPropertyBtn = document.getElementById("createPropertyBtn");

// Inputs
const propertyName = document.getElementById("propertyName");
const propertyLocation = document.getElementById("propertyLocation");
const propertyUnits = document.getElementById("propertyUnits");
const monthlyRent = document.getElementById("monthlyRent");

// Table
const propertiesTableBody =
document.getElementById("propertiesTableBody");

// ===========================================
// Get Current Landlord
// ===========================================

function getLandlordId() {

    return localStorage.getItem("landlordId");

}

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    try {

        const response = await fetch("/api/properties");

        const properties = await response.json();

        propertiesTableBody.innerHTML = "";

        if (properties.length === 0) {

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

                    <td>${property.propertyCode}</td>

                    <td>${property.propertyName}</td>

                    <td>${property.location}</td>

                    <td>${property.units}</td>

                    <td>KES ${Number(property.monthlyRent).toLocaleString()}</td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

// ===========================================
// Create Property
// ===========================================

createPropertyBtn.addEventListener("click", async () => {

    const landlordId = getLandlordId();

    if (!landlordId) {

        alert("Please register a landlord first.");

        return;

    }

    const data = {

        landlordId,

        propertyName: propertyName.value.trim(),

        location: propertyLocation.value.trim(),

        units: Number(propertyUnits.value),

        monthlyRent: Number(monthlyRent.value)

    };

    try {

        const response = await fetch("/api/properties", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            propertyName.value = "";
            propertyLocation.value = "";
            propertyUnits.value = "";
            monthlyRent.value = "";

            loadProperties();

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to create property.");

    }

});

// ===========================================
// Initialize
// ===========================================

loadProperties();