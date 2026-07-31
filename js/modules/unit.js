// ===========================================
// M-PESA Rent Wallet
// Unit Module (Version 9.3)
// ===========================================

// Form Elements
const createUnitBtn = document.getElementById("createUnitBtn");

const unitProperty = document.getElementById("unitProperty");
const unitNumber = document.getElementById("unitNumber");
const bedrooms = document.getElementById("bedrooms");
const unitRent = document.getElementById("unitRent");

// Table
const unitsTableBody = document.getElementById("unitsTableBody");

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    try {

        const response = await fetch("/api/properties");

        const properties = await response.json();

        unitProperty.innerHTML =
            `<option value="">Select Property</option>`;

        properties.forEach(property => {

            unitProperty.innerHTML += `

                <option value="${property.id}">

                    ${property.propertyName}

                </option>

            `;

        });

    }

    catch(error){

        console.error("Load Properties:", error);

    }

}

// ===========================================
// Load Units
// ===========================================

async function loadUnits() {

    try {

        const response = await fetch("/api/units");

        const units = await response.json();

        unitsTableBody.innerHTML = "";

        if (units.length === 0) {

            unitsTableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No units created.

                    </td>

                </tr>

            `;

            return;

        }

        units.forEach(unit => {

            unitsTableBody.innerHTML += `

                <tr>

                    <td>${unit.propertyName}</td>

                    <td>${unit.unitNumber}</td>

                    <td>${unit.bedrooms}</td>

                    <td>KES ${Number(unit.monthlyRent).toLocaleString()}</td>

                    <td>${unit.status}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error("Load Units:", error);

    }

}

// ===========================================
// Create Unit
// ===========================================

createUnitBtn.addEventListener("click", async () => {

    if (
        unitProperty.value === "" ||
        unitNumber.value === "" ||
        unitRent.value === ""
    ) {

        alert("Please complete all required fields.");

        return;

    }

    const data = {

        propertyId: unitProperty.value,

        unitNumber: unitNumber.value,

        bedrooms: Number(bedrooms.value),

        monthlyRent: Number(unitRent.value)

    };

    try {

        const response = await fetch("/api/units", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        alert(result.message);

        unitProperty.selectedIndex = 0;
        unitNumber.value = "";
        bedrooms.value = 1;
        unitRent.value = "";

        loadUnits();

    }

    catch(error){

        console.error(error);

        alert("Unable to create unit.");

    }

});

// ===========================================
// Initialize
// ===========================================

loadProperties();

loadUnits();